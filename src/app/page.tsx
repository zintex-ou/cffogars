import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DEFAULT_LANG, isLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Root() {
  void headers; void isLang;
  redirect(`/${DEFAULT_LANG}`);
}
