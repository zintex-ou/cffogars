import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { getFeed, LEAGUE_URL, LEAGUE_HOST, played } from "@/lib/league";
import { StandingsTable, NoData } from "@/components/league";
import { Sponsors } from "@/components/Footer";

export default async function Lliga({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  if (!feed) return <NoData t={t} />;
  const groupName = feed.group.name.replace(/^grup\s+/i, "");
  const lastRound = Math.max(0, ...feed.matches.filter(played).map((m) => m.round));
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.heroKicker} · {t.season} {feed.season} · {t.md} {lastRound}</div><h1 className="h-page">{t.group} {groupName}</h1></div>
      </div></section>
      <section className="wrap section">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px", marginBottom: 20, fontSize: 15, fontWeight: 600 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 16, height: 16, background: "var(--green)" }} />{t.promo}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 16, height: 16, background: "var(--red)" }} />{t.releg}</span>
          <a href={`${LEAGUE_URL}/lliga/${encodeURIComponent(feed.group.name)}`} target="_blank" rel="noopener" style={{ marginLeft: "auto", fontWeight: 700 }}>{t.officialFooter}: {LEAGUE_HOST} →</a>
        </div>
        <div style={{ borderTop: "4px solid var(--green)" }}><StandingsTable feed={feed} t={t} big /></div>
      </section>
      <Sponsors t={t} />
    </main>
  );
}
