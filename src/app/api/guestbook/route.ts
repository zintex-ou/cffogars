import { NextResponse } from "next/server";
import { addEntry, listEntries, newChallenge, verifyChallenge, consumeToken, recentFromIp, hideEntry } from "@/lib/guestbook";
import { isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const ipOf = (req: Request) => (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "0.0.0.0";
const links = /https?:\/\/|www\.|\.(com|net|org|ru|cn|xyz|top)\b/i;

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("captcha") != null) return NextResponse.json(newChallenge(), { headers: { "cache-control": "no-store" } });
  return NextResponse.json({ entries: listEntries() }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  let body: Record<string, string>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }); }
  const { name = "", message = "", token = "", answer = "", website = "", lang = "ca", ts = "" } = body;
  // honeypot + too-fast submission (< 3 s after the form was loaded)
  if (website.trim() !== "") return NextResponse.json({ ok: true, id: 0 });
  if (ts && Date.now() - Number(ts) < 3000) return NextResponse.json({ ok: true, id: 0 });
  const n = name.trim().slice(0, 60), m = message.trim().slice(0, 1500);
  if (n.length < 2 || m.length < 3) return NextResponse.json({ error: "invalid" }, { status: 400 });
  if (links.test(m) || links.test(n) || (m.match(/http/gi) ?? []).length > 0) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const ip = ipOf(req);
  if (recentFromIp(ip, 10) >= 3) return NextResponse.json({ error: "rate" }, { status: 429 });
  if (!verifyChallenge(token, answer)) return NextResponse.json({ error: "captcha" }, { status: 400 });
  if (!consumeToken(token)) return NextResponse.json({ error: "captcha" }, { status: 400 });
  const id = addEntry({ name: n, message: m, lang: isLang(lang) ? lang : "ca", ip });
  return NextResponse.json({ ok: true, id });
}

/** Moderation: DELETE /api/guestbook?id=12 with header `x-admin-token: $ADMIN_TOKEN` */
export async function DELETE(req: Request) {
  const tok = process.env.ADMIN_TOKEN;
  if (!tok || req.headers.get("x-admin-token") !== tok) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "invalid" }, { status: 400 });
  hideEntry(id);
  return NextResponse.json({ ok: true });
}
