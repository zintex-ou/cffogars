import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { getFeed, leagueAsset } from "@/lib/league";
import { CLUB, STORY, TIMELINE, PALMARES, SEASONS, pick } from "@/content/club";
import { played } from "@/lib/league";
import { ordinal } from "@/lib/i18n";

export default async function Historia({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  const founded = CLUB.founded ?? feed?.team.founded ?? null;
  const photo = CLUB.historyPhoto ?? leagueAsset(feed?.team.photo ?? null);
  const groupName = feed ? feed.group.name.replace(/^grup\s+/i, "") : "";
  const me = feed?.standings.find((r) => r.team.id === feed.team.id);
  const rows = [...SEASONS.map((s) => ({ ...s, current: false }))];
  if (feed && me) rows.push({ season: feed.season, name: feed.team.name, group: groupName, pos: me.pos, teams: feed.standings.length, pj: me.pj, w: me.w, d: me.d, l: me.l, gf: me.gf, gc: me.gc, pts: me.pts, current: true });
  const tot = rows.reduce((a, r) => ({ pj: a.pj + r.pj, w: a.w + r.w, d: a.d + r.d, l: a.l + r.l, gf: a.gf + r.gf, gc: a.gc + r.gc, pts: a.pts + r.pts }), { pj: 0, w: 0, d: 0, l: 0, gf: 0, gc: 0, pts: 0 });
  const dg = (n: number) => (n > 0 ? `+${n}` : String(n));
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.storyKicker}</div><h1 className="h-page">{t.historyTitle}</h1></div>
      </div></section>
      {photo && <div className="hphoto" style={{ backgroundImage: `url(${photo})` }}>{CLUB.historyPhotoCaption && <span className="tag" style={{ position: "absolute", left: "clamp(20px,5vw,64px)", bottom: 16, background: "var(--green-dark)", color: "#fff" }}>{CLUB.historyPhotoCaption}</span>}</div>}
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
      {rows.length > 0 && (
        <section className="wrap" style={{ paddingBottom: "clamp(40px,5vw,72px)" }}>
          <h2 className="h-sec rule">{t.seasonsTitle}</h2>
          <div className="scroll"><table className="tbl" style={{ minWidth: 640 }}>
            <thead><tr><th className="l">{t.seasonCol}</th><th className="l">{t.teamCol}</th><th>{t.group}</th><th>{t.posCol}</th><th>{t.P}</th><th>{t.W}</th><th>{t.Dr}</th><th>{t.L}</th><th>{t.GF}</th><th>{t.GA}</th><th>{t.GD}</th><th className="r">{t.Pts}</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.season} className={r.current ? "me" : ""}>
                  <td className="l" style={{ fontWeight: 700 }}>{r.season}{r.current && <span style={{ color: "var(--muted)", fontWeight: 400 }}> · {t.current}</span>}</td>
                  <td className="l">{r.name}</td><td>{r.group}</td>
                  <td style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 20, color: "var(--green)" }}>{ordinal(lang, r.pos)}<span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>/{r.teams}</span></td>
                  <td>{r.pj}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td><td>{r.gf}</td><td>{r.gc}</td><td>{dg(r.gf - r.gc)}</td><td className="pts r">{r.pts}</td>
                </tr>
              ))}
              <tr style={{ background: "var(--paper)" }}>
                <td className="l" colSpan={4} style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 18, textTransform: "uppercase" }}>{t.total}</td>
                <td style={{ fontWeight: 700 }}>{tot.pj}</td><td style={{ fontWeight: 700 }}>{tot.w}</td><td style={{ fontWeight: 700 }}>{tot.d}</td><td style={{ fontWeight: 700 }}>{tot.l}</td><td style={{ fontWeight: 700 }}>{tot.gf}</td><td style={{ fontWeight: 700 }}>{tot.gc}</td><td style={{ fontWeight: 700 }}>{dg(tot.gf - tot.gc)}</td><td className="pts r">{tot.pts}</td>
              </tr>
            </tbody>
          </table></div>
        </section>
      )}
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
