import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { getFeed, leagueAsset } from "@/lib/league";
import { CLUB, STORY, TIMELINE, PALMARES, pick } from "@/content/club";

export default async function Historia({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  const founded = CLUB.founded ?? feed?.team.founded ?? null;
  const photo = CLUB.historyPhoto ?? leagueAsset(feed?.team.photo ?? null);
  const groupName = feed ? feed.group.name.replace(/^grup\s+/i, "") : "";
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.storyKicker}</div><h1 className="h-page">{t.historyTitle}</h1></div>
      </div></section>
      {photo && <div className="hphoto" style={{ backgroundImage: `url(${photo})` }} />}
      <section className="wrap section story">
        <div className="yr">
          {founded && <b>{founded}</b>}
          <span>{CLUB.town} · Girona</span>
          {CLUB.groundPhoto && <img src={CLUB.groundPhoto} alt={CLUB.ground} style={{ width: "100%", maxWidth: 345, marginTop: 16, display: "block" }} />}
          <div className="fitxa" style={{ marginTop: 16 }}>
            {founded && <div><span>{t.founded}</span><b>{founded}</b></div>}
            <div><span>{t.ground}</span><b>{CLUB.ground}</b></div>
            <div><span>{t.colors}</span><b>{pick(lang, CLUB.colors)}</b></div>
            {feed && <div><span>{t.league}</span><b>{t.heroKicker} · {t.group} {groupName}</b></div>}
          </div>
        </div>
        <div className="txt">
          {STORY.map((p, i) => <p key={i}>{pick(lang, p)}</p>)}
          {feed?.team.info && <p>{feed.team.info}</p>}
        </div>
      </section>
      {TIMELINE.length > 0 && (
        <section style={{ background: "var(--green-light)" }}><div className="wrap section">
          <h2 className="h-big" style={{ marginBottom: "clamp(32px,4vw,56px)", color: "var(--green-dark)" }}>{t.timeline}</h2>
          <div className="tl">
            {TIMELINE.map((e, i) => <div key={i} className="e"><span className="y">{e.y}</span><span className="b"><b>{pick(lang, e.title)}</b><span>{pick(lang, e.text)}</span></span></div>)}
          </div>
        </div></section>
      )}
      {PALMARES.length > 0 && (
        <section className="wrap section">
          <h2 className="h-big" style={{ marginBottom: "clamp(32px,4vw,56px)" }}>{t.palmares}</h2>
          <div className="palm">{PALMARES.map((h, i) => <div key={i}><span className="n">{h.n}</span><span className="l">{pick(lang, h.label)}</span><span className="s">{h.sub}</span></div>)}</div>
        </section>
      )}
    </main>
  );
}
