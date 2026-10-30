import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { register, login, sessionCookie, verifyChallenge, consumeToken } from "@/lib/guestbook";

export const dynamic = "force-dynamic";
const COOKIE = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 365, secure: process.env.NODE_ENV === "production" };

export async function POST(req: Request) {
  let b: Record<string, string>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }); }
  const c = await cookies();
  if (b.action === "logout") { c.delete("gbu"); return NextResponse.json({ ok: true }); }
  const nick = (b.nick ?? "").trim(), pass = b.pass ?? "";
  if (b.action === "register") {
    if (!verifyChallenge(b.token, b.answer) || !consumeToken(b.token)) return NextResponse.json({ error: "captcha" }, { status: 400 });
    const r = register(nick, pass);
    if (!r.ok) return NextResponse.json({ error: r.error }, { status: 400 });
    c.set("gbu", sessionCookie(r.user.id), COOKIE);
    return NextResponse.json({ ok: true, user: r.user });
  }
  const u = login(nick, pass);
  if (!u) return NextResponse.json({ error: "login" }, { status: 401 });
  c.set("gbu", sessionCookie(u.id), COOKIE);
  return NextResponse.json({ ok: true, user: u });
}
