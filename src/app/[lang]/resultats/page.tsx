import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { getFeed, played, outcome } from "@/lib/league";
import { ResultCard, NoData } from "@/components/league";

export default async function Resultats({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  if (!feed) return <NoData t={t} />;
  const groupName = feed.group.name.replace(/^grup\s+/i, "");
  const list = feed.matches.filter(played).sort((a, b) => b.date.localeCompare(a.date) || b.round - a.round);
  const cnt = (o: "W" | "D" | "L") => list.filter((m) => outcome(feed, m) === o).length;
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.season} {feed.season} · {t.group} {groupName}</div><h1 className="h-page">{t.results}</h1></div>
        <div className="record">
          <div><b>{cnt("W")}</b><small>{t.wins}</small></div>
          <div><b>{cnt("D")}</b><small>{t.draws}</small></div>
          <div><b>{cnt("L")}</b><small>{t.losses}</small></div>
        </div>
      </div></section>
      <section className="wrap section rgrid">
        {list.map((m) => <ResultCard key={m.id} feed={feed} m={m} t={t} lang={lang} />)}
      </section>
    </main>
  );
}
