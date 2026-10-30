import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Root() {
  const h = await headers();
  const accept = (h.get("accept-language") ?? "").toLowerCase();
  const first = accept.split(",").map((s) => s.trim().slice(0, 2)).find(isLang);
  redirect(`/${first ?? DEFAULT_LANG}`);
}
