import { NextResponse } from "next/server";
import { db, verifyChallenge, consumeToken, recentFromIp } from "@/lib/guestbook";

export const dynamic = "force-dynamic";
const ipOf = (req: Request) => (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
function table() {
  const d = db();
  d.exec(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, lang TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))`);
  return d;
}

export async function POST(req: Request) {
  let body: Record<string, string>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }); }
  const { name = "", email = "", message = "", token = "", answer = "", website = "", lang = "ca", ts = "" } = body;
  if (website.trim() !== "" || (ts && Date.now() - Number(ts) < 3000)) return NextResponse.json({ ok: true });
  const n = name.trim().slice(0, 80), e = email.trim().slice(0, 120), m = message.trim().slice(0, 3000);
  if (n.length < 2 || m.length < 5 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const ip = ipOf(req);
  if (recentFromIp(ip, 10) >= 3) return NextResponse.json({ error: "rate" }, { status: 429 });
  if (!verifyChallenge(token, answer) || !consumeToken(token)) return NextResponse.json({ error: "captcha" }, { status: 400 });
  table().prepare("INSERT INTO messages (name, email, message, lang) VALUES (?, ?, ?, ?)").run(n, e, m, lang);
  return NextResponse.json({ ok: true });
}

/** Read messages: GET /api/contact with header x-admin-token */
export async function GET(req: Request) {
  const tok = process.env.ADMIN_TOKEN;
  if (!tok || req.headers.get("x-admin-token") !== tok) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  return NextResponse.json({ messages: table().prepare("SELECT * FROM messages ORDER BY id DESC LIMIT 200").all() }, { headers: { "cache-control": "no-store" } });
}
