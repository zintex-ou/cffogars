import { type Feed, type Match, type Row, type TeamInfo, initials, isMine, played, outcome, myScorers, mapUrl, matchUrl, leagueAsset } from "@/lib/league";
import { type Lang, type Dict, fmtDate } from "@/lib/i18n";

export function Badge({ team, size = 30, dark }: { team: TeamInfo; size?: number; dark?: boolean }) {
  const logo = leagueAsset(team.logo);
  return (
    <span className="badge" style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: dark ? "var(--green)" : "var(--paper-2)", color: dark ? "#fff" : "var(--muted)" }}>
      {logo ? <img src={logo} alt="" loading="lazy" /> : initials(team)}
    </span>
  );
}

export function StandingsTable({ feed, t, rows, big }: { feed: Feed; t: Dict; rows?: Row[]; big?: boolean }) {
  const list = rows ?? feed.standings;
  const n = feed.standings.length;
  return (
    <div className="scroll">
      <table className={`tbl${big ? " big" : ""}`} style={{ minWidth: big ? 760 : 520 }}>
        <thead>
          <tr>
            <th className="l">{t.pos}</th><th className="l">{t.teamCol}</th><th>{t.P}</th><th>{t.W}</th><th>{t.Dr}</th><th>{t.L}</th>
            {big && <><th>{t.GF}</th><th>{t.GA}</th></>}
            <th>{t.GD}</th>
            {big && <th style={{ width: 130 }}>{t.form}</th>}
            <th className="r">{t.Pts}</th>
          </tr>
        </thead>
        <tbody>
          {list.map((r) => {
            const me = r.team.id === feed.team.id;
            const zone = r.pos <= feed.group.topSlots ? "up" : r.pos > n - feed.group.relegSlots ? "dn" : "";
            return (
              <tr key={r.team.id} className={`${me ? "me" : ""} ${zone}`}>
                <td className="pos l">{r.pos}</td>
                <td className="l"><span className="tn"><Badge team={r.team} dark={me} size={big ? 34 : 30} />{r.team.name}</span></td>
                <td>{r.pj}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td>
                {big && <><td>{r.gf}</td><td>{r.gc}</td></>}
                <td>{r.dg > 0 ? `+${r.dg}` : r.dg}</td>
                {big && <td><span className="form">{r.form.slice(-5).map((f, i) => <span key={i} className={f}>{f === "W" ? t.W : f === "D" ? t.Dr : t.L}</span>)}</span></td>}
                <td className="pts r">{r.pts}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function FixtureRow({ feed, m, t, lang, next }: { feed: Feed; m: Match; t: Dict; lang: Lang; next?: boolean }) {
  const home = isMine(feed, m);
  const d = fmtDate(lang, m.date);
  const pp = m.status === "postponed" || m.status === "cancelled";
  const mid = played(m) ? `${m.homeGoals} – ${m.awayGoals}` : pp ? t.postponed : m.time ?? "—";
  return (
    <div className={`fx${next ? " next" : ""}`}>
      <div className="md"><small>{t.md}</small><b>{m.round}</b></div>
      <div className="when"><b>{d.day}</b><span>{d.short}{m.time && !played(m) ? ` · ${m.time} h` : ""}</span></div>
      <div className="teams">
        <span className={`h${home ? " me" : ""}`}>{m.home.name}</span>
        <span className={`mid${played(m) ? " played" : next ? " nx" : ""}${pp ? " pp" : ""}`}>{mid}</span>
        <span className={`a${home ? "" : " me"}`}>{m.away.name}</span>
      </div>
      <div className="where">
        <span className="pin" />
        {m.field ? <a href={mapUrl(m.field, m.home.town)} target="_blank" rel="noopener">{m.field}</a> : <span>{m.home.town ?? ""}</span>}
      </div>
      <span className={`ha${home ? " home" : ""}`}>{home ? t.homeG : t.away}</span>
    </div>
  );
}

export function ResultCard({ feed, m, t, lang }: { feed: Feed; m: Match; t: Dict; lang: Lang }) {
  const home = isMine(feed, m);
  const out = outcome(feed, m) ?? "D";
  const d = fmtDate(lang, m.date);
  const sc = myScorers(m);
  return (
    <article className={`rcard ${out}`}>
      <div className="head">
        <span>{t.md} {m.round} · {d.short}</span>
        <span className="tag out">{out === "W" ? t.win : out === "D" ? t.draw : t.loss}</span>
      </div>
      <div className="body">
        <span className={`tm${home ? " me" : ""}`}>{m.home.name}</span>
        <span className="sc">{m.homeGoals}<span className="dash">–</span>{m.awayGoals}</span>
        <span className={`tm r${home ? "" : " me"}`}>{m.away.name}</span>
      </div>
      {sc.length > 0 && (
        <div className="scr">
          <div className="scorers-h">{t.scorers} · {feed.team.short ?? feed.team.name}</div>
          <div className="lst">{sc.map((s) => <span key={s.name}><b>{s.name}</b> <span>{s.mins}</span></span>)}</div>
        </div>
      )}
      <a className="more" href={matchUrl(m)} target="_blank" rel="noopener">{t.report}<span>→</span></a>
    </article>
  );
}

export function NoData({ t }: { t: Dict }) {
  return <div className="wrap section"><div className="alert">{t.noData}</div></div>;
}
