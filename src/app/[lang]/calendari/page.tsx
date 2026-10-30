import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { getFeed, isMine } from "@/lib/league";
import { FixtureRow, NoData } from "@/components/league";
import Filter from "./Filter";
import ScrollToNext from "./ScrollToNext";

export default async function Calendari({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ f?: string }> }) {
  const { lang } = await params;
  const { f = "all" } = await searchParams;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  if (!feed) return <NoData t={t} />;
  const groupName = feed.group.name.replace(/^grup\s+/i, "");
  const all = [...feed.matches].sort((a, b) => a.round - b.round);
  const list = all.filter((m) => f === "all" || (f === "home" ? isMine(feed, m) : !isMine(feed, m)));
  const maxRound = Math.max(...all.map((m) => m.round));
  const half = Math.ceil(maxRound / 2);
  const rounds = [
    { title: `${t.first} · J1–J${half}`, items: list.filter((m) => m.round <= half) },
    { title: `${t.second} · J${half + 1}–J${maxRound}`, items: list.filter((m) => m.round > half) },
  ].filter((r) => r.items.length);
  const nextId = feed.nextMatch?.id;
  const chips = [["all", t.all], ["home", t.homeG], ["away", t.away]] as [string, string][];
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.season} {feed.season} · {t.group} {groupName}</div><h1 className="h-page">{t.fixtures}</h1></div>
        <Filter chips={chips} current={f} />
      </div></section>
      <section className="wrap section" style={{ display: "flex", flexDirection: "column", gap: 48 }}>
        {rounds.map((r) => (
          <div key={r.title}>
            <h2 className="h-sec rule" style={{ fontSize: "clamp(32px,3.4vw,44px)", paddingBottom: 12 }}>{r.title}</h2>
            <div>{r.items.map((m) => <div key={m.id} id={m.id === nextId ? "next-match" : undefined}><FixtureRow feed={feed} m={m} t={t} lang={lang} next={m.id === nextId} /></div>)}</div>
          </div>
        ))}
      </section>
      <ScrollToNext />
    </main>
  );
}
