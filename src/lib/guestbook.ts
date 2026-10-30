import Database from "better-sqlite3";
import { createHmac, randomBytes, timingSafeEqual, scryptSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const SECRET = process.env.GUESTBOOK_SECRET || (process.env.NODE_ENV === "production" ? "" : "dev-secret");

let _db: Database.Database | null = null;
export function db() {
  if (_db) return _db;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  _db = new Database(path.join(DATA_DIR, "guestbook.sqlite"));
  _db.pragma("journal_mode = WAL");
  _db.exec(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, message TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'ca',
    ip_hash TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), hidden INTEGER NOT NULL DEFAULT 0
  )`);
  return _db;
}

export type Entry = { id: number; name: string; message: string; lang: string; created_at: string };
export function listEntries(limit = 200): Entry[] {
  return db().prepare("SELECT id, name, message, lang, created_at FROM entries WHERE hidden = 0 ORDER BY id DESC LIMIT ?").all(limit) as Entry[];
}
export function addEntry(e: { name: string; message: string; lang: string; ip: string }) {
  const r = db().prepare("INSERT INTO entries (name, message, lang, ip_hash) VALUES (?, ?, ?, ?)").run(e.name, e.message, e.lang, hashIp(e.ip));
  return Number(r.lastInsertRowid);
}
export function hideEntry(id: number) { db().prepare("UPDATE entries SET hidden = 1 WHERE id = ?").run(id); }
export function recentFromIp(ip: string, minutes: number) {
  const r = db().prepare("SELECT COUNT(*) AS n FROM entries WHERE ip_hash = ? AND created_at > datetime('now', ?)").get(hashIp(ip), `-${minutes} minutes`) as { n: number };
  return r.n;
}
const hashIp = (ip: string) => createHmac("sha256", SECRET || "x").update(ip).digest("hex").slice(0, 24);

/* ---- captcha: a small arithmetic question, HMAC-signed so the server stays stateless ---- */
const TTL_MS = 15 * 60 * 1000;
export function newChallenge() {
  if (!SECRET) throw new Error("GUESTBOOK_SECRET is not set");
  const a = 2 + Math.floor(Math.random() * 8), b = 1 + Math.floor(Math.random() * 9);
  const op = Math.random() < 0.6 ? "+" : "×";
  const answer = op === "+" ? a + b : a * b;
  const exp = Date.now() + TTL_MS;
  const nonce = randomBytes(6).toString("hex");
  const token = `${exp}.${nonce}.${sign(`${exp}.${nonce}.${answer}`)}`;
  return { question: `${a} ${op} ${b}`, token };
}
export function verifyChallenge(token: string, answer: string) {
  const [exp, nonce, sig] = (token ?? "").split(".");
  if (!exp || !nonce || !sig || Number(exp) < Date.now()) return false;
  const n = Number(String(answer).trim());
  if (!Number.isInteger(n)) return false;
  const expect = sign(`${exp}.${nonce}.${n}`);
  return sig.length === expect.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expect));
}
const sign = (s: string) => createHmac("sha256", SECRET).update(s).digest("hex").slice(0, 32);

/* ---- used-token guard (one answer per token) ---- */
const used = new Map<string, number>();
export function consumeToken(token: string) {
  const now = Date.now();
  for (const [k, v] of used) if (v < now) used.delete(k);
  if (used.has(token)) return false;
  used.set(token, now + TTL_MS);
  return true;
}

/* ---------------- users & sessions ---------------- */
export type User = { id: number; nick: string; player_id: number | null; status: string | null; created_at: string };
function usersTable() {
  const d = db();
  d.exec(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, nick TEXT NOT NULL UNIQUE COLLATE NOCASE, pass TEXT NOT NULL, player_id INTEGER, status TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  try { d.exec("ALTER TABLE entries ADD COLUMN user_id INTEGER"); } catch {}
  return d;
}
const hashPass = (p: string, salt = randomBytes(8).toString("hex")) => `${salt}:${scryptSync(p, salt, 32).toString("hex")}`;
export function register(nick: string, pass: string): { ok: true; user: User } | { ok: false; error: string } {
  const d = usersTable();
  if (!/^[\p{L}\p{N} _.'-]{2,24}$/u.test(nick)) return { ok: false, error: "nick" };
  if (pass.length < 6) return { ok: false, error: "pass" };
  if (d.prepare("SELECT id FROM users WHERE nick = ?").get(nick)) return { ok: false, error: "taken" };
  const r = d.prepare("INSERT INTO users (nick, pass) VALUES (?, ?)").run(nick, hashPass(pass));
  return { ok: true, user: getUser(Number(r.lastInsertRowid))! };
}
export function login(nick: string, pass: string): User | null {
  const row = usersTable().prepare("SELECT * FROM users WHERE nick = ?").get(nick) as (User & { pass: string }) | undefined;
  if (!row) return null;
  const [salt, h] = row.pass.split(":");
  const h2 = scryptSync(pass, salt, 32).toString("hex");
  if (h.length !== h2.length || !timingSafeEqual(Buffer.from(h), Buffer.from(h2))) return null;
  const { pass: _p, ...u } = row; void _p;
  return u;
}
export function getUser(id: number): User | null {
  return (usersTable().prepare("SELECT id, nick, player_id, status, created_at FROM users WHERE id = ?").get(id) as User) ?? null;
}
export function listUsers(): User[] { return usersTable().prepare("SELECT id, nick, player_id, status, created_at FROM users ORDER BY id").all() as User[]; }
export function updateUser(id: number, playerId: number | null, status: string | null) {
  usersTable().prepare("UPDATE users SET player_id = ?, status = ? WHERE id = ?").run(playerId, status, id);
}
/* session cookie: "<id>.<sig>" */
export const sessionCookie = (id: number) => `${id}.${sign(`u${id}`)}`;
export function userFromCookie(v: string | undefined): User | null {
  if (!v) return null;
  const [id, sig] = v.split(".");
  if (!id || !sig || sign(`u${id}`) !== sig) return null;
  return getUser(Number(id));
}
export const adminCookieValue = () => sign("admin:" + (process.env.ADMIN_TOKEN ?? ""));
export const isAdminCookie = (v: string | undefined) => !!process.env.ADMIN_TOKEN && !!v && v === adminCookieValue();

export type EntryFull = Entry & { user_id: number | null; nick: string | null; player_id: number | null; status: string | null };
export function listEntriesFull(limit = 200): EntryFull[] {
  usersTable();
  return db().prepare(`SELECT e.id, e.name, e.message, e.lang, e.created_at, e.user_id, u.nick, u.player_id, u.status FROM entries e LEFT JOIN users u ON u.id = e.user_id WHERE e.hidden = 0 ORDER BY e.id DESC LIMIT ?`).all(limit) as EntryFull[];
}
export function addEntryUser(e: { userId: number; name: string; message: string; lang: string; ip: string }) {
  usersTable();
  const r = db().prepare("INSERT INTO entries (name, message, lang, ip_hash, user_id) VALUES (?, ?, ?, ?, ?)").run(e.name, e.message, e.lang, hashIp(e.ip), e.userId);
  return Number(r.lastInsertRowid);
}
