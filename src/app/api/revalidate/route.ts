import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/** POST /api/revalidate?token=ADMIN_TOKEN — refresh cached data (Veo videos, league feed). Called by cron on Sundays. */
export async function POST(req: Request) {
  const tok = process.env.ADMIN_TOKEN;
  if (!tok || new URL(req.url).searchParams.get("token") !== tok) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  revalidateTag("veo", "max");
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
