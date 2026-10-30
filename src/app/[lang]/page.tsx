import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, t as dict, fmtDate, ordinal } from "@/lib/i18n";
import { getFeed, LEAGUE_URL, LEAGUE_HOST, isMine, myScorers, mapUrl, matchUrl, leagueAsset, displayName, played } from "@/lib/league";
import { Badge, StandingsTable, NoData } from "@/components/league";
import { Sponsors } from "@/components/Footer";
import { CLUB } from "@/content/club";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  if (!feed) return <NoData t={t} />;

  const me = feed.standings.find((r) => r.team.id === feed.team.id);
  const last = feed.lastMatch, next = feed.nextMatch;
  const lastRound = Math.max(0, ...feed.matches.filter(played).map((m) => m.round));
  const groupName = feed.group.name.replace(/^grup\s+/i, "");
  const heroPhoto = CLUB.heroPhoto ?? leagueAsset(feed.team.photo);
  // standings excerpt: 8 rows around us
  const n = feed.standings.length;
  let start = Math.max(0, (me?.pos ?? 1) - 4);
  start = Math.min(start, Math.max(0, n - 8));
  const excerpt = feed.standings.slice(start, start + 8);
  const scorers = [...feed.squad].filter((p) => p.goals > 0).sort((a, b) => b.goals - a.goals || b.assists - a.assists).slice(0, 5);
  const [top, ...rest] = scorers;
  const nd = next ? fmtDate(lang, next.date) : null;

  return (
    <main>
      <section className="hero">
        {heroPhoto && <div className="photo" style={{ backgroundImage: `url(${heroPhoto})` }} />}
        <div className="overlay" />
        <div className="wrap">
          <div className="meta">
            {me && <span className="pill">{ordinal(lang, me.pos)} · {me.pts} pts</span>}
            <span>{t.heroKicker}</span>
            <span>{t.season} {feed.season}</span>
          </div>
          <h1>
            <span style={{ display: "block" }}>{CLUB.shortName}</span>
            <span className="outline">{t.group} {groupName}</span>
          </h1>
          <div className="cards">
            {last ? (
              <article className="card light">
                <div className="head"><span className="title">{t.lastMatch}</span><span className="sub">J{last.round} · {fmtDate(lang, last.date).short}</span></div>
                <div className="score-row">
                  <div className={`team${isMine(feed, last) ? "" : " other"}`}><Badge team={last.home} size={64} dark={isMine(feed, last)} />{last.home.name}</div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span className="score">{last.homeGoals}<span className="dash">–</span>{last.awayGoals}</span>
                    <span className="tag" style={{ marginTop: 6, background: "var(--green-light)", color: "var(--green-dark)", fontSize: 14, letterSpacing: ".14em" }}>{t.final}</span>
                  </div>
                  <div className={`team${isMine(feed, last) ? " other" : ""}`}><Badge team={last.away} size={64} dark={!isMine(feed, last)} />{last.away.name}</div>
                </div>
                {myScorers(last).length > 0 && (
                  <div style={{ borderTop: "1px solid var(--line-2)", paddingTop: 18 }}>
                    <div className="scorers-h">{t.scorers} · {CLUB.shortName}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {myScorers(last).map((s) => <div key={s.name} className="scorer"><b>{s.name}</b><span>{s.mins}</span></div>)}
                    </div>
                  </div>
                )}
                <a className="link-cta" href={matchUrl(last)} target="_blank" rel="noopener">{t.report} →</a>
              </article>
            ) : null}
            <article className="card green">
              <div className="head"><span className="title">{t.nextMatch}</span>{next && <span className="sub">{t.md} {next.round}</span>}</div>
              {next && nd ? (
                <>
                  <div className="next-date">
                    <span className="dm">{nd.dayMonth}</span>
                    <span className="side">
                      <span className="d">{nd.day}</span><span className="dt">{nd.short}</span>
                      <span className="tm">{next.time ? `${next.time} h` : t.tbd}</span>
                    </span>
                  </div>
                  <div className="vs-row">
                    <div className="side"><Badge team={next.home} size={48} dark />{next.home.name}</div>
                    <span className="vs">VS</span>
                    <div className="side r">{next.away.name}<Badge team={next.away} size={48} /></div>
                  </div>
                  {next.field && (
                    <a className="venue" href={mapUrl(next.field, next.home.town)} target="_blank" rel="noopener">
                      <span className="ico"><span className="pin" /></span>
                      <span><span className="v1">{next.field}</span><span className="v2">{t.map} →</span></span>
                    </a>
                  )}
                </>
              ) : <p style={{ margin: 0, fontSize: 18 }}>{t.noNext}</p>}
            </article>
          </div>
        </div>
      </section>

      <section className="wrap" style={{ paddingTop: "clamp(56px,7vw,104px)", paddingBottom: "clamp(56px,7vw,104px)", display: "flex", flexWrap: "wrap", gap: "clamp(32px,4vw,56px)" }}>
        <div style={{ flex: "2 1 560px", minWidth: 0 }}>
          <div className="rule" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div className="kicker dark">{t.group} {groupName} · J{lastRound}</div>
              <h2 className="h-sec" style={{ marginTop: 4 }}>{t.table}</h2>
            </div>
            <Link className="btn" href={`/${lang}/lliga`}>{t.fullTable} →</Link>
          </div>
          <StandingsTable feed={feed} t={t} rows={excerpt} />
        </div>
        <aside style={{ flex: "1 1 320px", minWidth: 0 }}>
          <div className="rule">
            <div className="kicker dark">{CLUB.shortName}</div>
            <h2 className="h-sec" style={{ marginTop: 4 }}>{t.topScorers}</h2>
          </div>
          {top ? (
            <>
              <div className="top1">
                <div className="txt">
                  <div className="n">{top.goals}</div>
                  <div>
                    <div className="name">{displayName(top)}</div>
                    <div className="meta">{feed.team.name}{top.dorsal != null ? ` · #${top.dorsal}` : ""} · {t.goals}</div>
                  </div>
                </div>
                <div className="ph" style={top.photo ? { backgroundImage: `url(${leagueAsset(top.photo)})` } : undefined} />
              </div>
              <div>
                {rest.map((p, i) => (
                  <div key={p.id} className="srow">
                    <span className="rk">{i + 2}</span>
                    <span className="nm"><span style={{ fontWeight: 600 }}>{displayName(p)}</span><small>{p.assists} {t.a.toLowerCase()}</small></span>
                    <span className="g">{p.goals}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p style={{ color: "var(--muted)" }}>—</p>}
        </aside>
      </section>

      <section style={{ background: "var(--green-dark)", color: "#fff" }}>
        <div className="wrap" style={{ paddingTop: "clamp(48px,6vw,88px)", paddingBottom: "clamp(48px,6vw,88px)", display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 32 }}>
          <div style={{ flex: "1 1 520px" }}>
            <div className="kicker" style={{ fontSize: 16 }}>{LEAGUE_HOST}</div>
            <h2 className="h-big" style={{ marginTop: 10, fontSize: "clamp(44px,6vw,88px)" }}>{t.offTitle}</h2>
            <p style={{ margin: "18px 0 0", maxWidth: 560, fontSize: 18, color: "var(--green-light)" }}>{t.offText}</p>
          </div>
          <a className="btn solid" href={`${LEAGUE_URL}/equip/${feed.team.slug}`} target="_blank" rel="noopener">{t.visit} →</a>
        </div>
      </section>

      <Sponsors t={t} />
    </main>
  );
}
