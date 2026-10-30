import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { isLang } from "@/lib/i18n";
import { isAdminCookie, listUsers, listEntriesFull, listMessages } from "@/lib/guestbook";
import { getFeed, displayName } from "@/lib/league";
import Admin from "./Admin";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const ok = isAdminCookie((await cookies()).get("gba")?.value);
  const feed = ok ? await getFeed() : null;
  const players = (feed?.squad ?? []).map((p) => ({ id: p.id, label: `${p.dorsal != null ? `#${p.dorsal} ` : ""}${displayName(p)}` })).sort((a, b) => a.label.localeCompare(b.label));
  return (
    <main>
      <section className="page-hero"><div className="wrap"><div><div className="kicker">Llibre de visites</div><h1 className="h-page">Admin</h1></div></div></section>
      <section className="wrap section">
        <Admin authed={ok} users={ok ? listUsers() : []} entries={ok ? listEntriesFull(100) : []} messages={ok ? listMessages() : []} players={players} />
      </section>
    </main>
  );
}
