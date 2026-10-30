import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminCookieValue, isAdminCookie, updateUser, hideEntry } from "@/lib/guestbook";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let b: Record<string, string | number | null>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "invalid" }, { status: 400 }); }
  const c = await cookies();
  if (b.action === "login") {
    if (!process.env.ADMIN_TOKEN || b.token !== process.env.ADMIN_TOKEN) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    c.set("gba", adminCookieValue(), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "production" });
    return NextResponse.json({ ok: true });
  }
  if (!isAdminCookie(c.get("gba")?.value)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (b.action === "logout") { c.delete("gba"); return NextResponse.json({ ok: true }); }
  if (b.action === "user") { updateUser(Number(b.id), b.playerId ? Number(b.playerId) : null, String(b.status ?? "").trim().slice(0, 60) || null); return NextResponse.json({ ok: true }); }
  if (b.action === "hide") { hideEntry(Number(b.id)); return NextResponse.json({ ok: true }); }
  return NextResponse.json({ error: "invalid" }, { status: 400 });
}
