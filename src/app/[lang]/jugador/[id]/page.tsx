import Link from "next/link";
import { notFound } from "next/navigation";
import { isLang, t as dict, posLabel, fmtDate } from "@/lib/i18n";
import { getPlayer, leagueAsset, LEAGUE_URL } from "@/lib/league";
import { Badge } from "@/components/league";
import { localPhoto } from "@/content/portraits";

export const revalidate = 300;

const RATIO: Record<string, number> = { "0": 0.449, "1": 0.23, "2": 0.463, "3": 0.45, "4": 0.477, "5": 0.439, "6": 0.459, "7": 0.458, "8": 0.435, "9": 0.45 };

export async function generateMetadata({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { id } = await params;
  const c = await getPlayer(Number(id));
  return c ? { title: `${c.player.name} ${c.player.surname} · ${c.team.name}` } : {};
}

export default async function Jugador({ params }: { params: Promise<{ lang: string; id: string }> }) {
  const { lang, id } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const c = await getPlayer(Number(id));
  if (!c) notFound();
  const { player: p, team, stats: st, history } = c;
  const gk = p.position === "POR";
  const photo = localPhoto(p) ?? leagueAsset(p.photo);
  const label = (r: string) => (t as Record<string, string>)[r] ?? r;
  const hist = [...history].reverse();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div>
          <div className="kicker">{t.playerCard} · {team.name}</div>
          <h1 className="h-page">{p.name} <span className="jout">{p.surname}</span></h1>
        </div>
        <Link className="btn white" href={`/${lang}/equip`}>← {t.backToSquad}</Link>
      </div></section>

      <section className="wrap jcard">
        <div className="jphoto">
          <div className="ph" style={photo ? { backgroundImage: `url(${photo})` } : undefined}>
            {!photo && <span className="sil"><svg viewBox="0 0 100 90"><circle cx="50" cy="28" r="18" /><path d="M10 90c0-24 18-36 40-36s40 12 40 36z" /></svg></span>}
            {p.dorsal != null && <span className="num" aria-label={String(p.dorsal)}>{String(p.dorsal).split("").map((ch, i) => <span key={i} className="dg" style={{ aspectRatio: String(RATIO[ch] ?? 0.45), ["--m" as string]: `url(/numbers/${ch}.svg)` }} />)}</span>}
          </div>
          <div className="meta">
            <span className="pos">{posLabel(lang, p.position)}</span>
            {p.dorsal != null && <span>· {t.dorsal} {p.dorsal}</span>}
            {p.age != null && <span>· {p.age} {t.age}</span>}
            {st.suspended > 0 && <span className="tag" style={{ background: "var(--card-red)", color: "#fff" }}>{t.suspended} · {st.suspended}</span>}
            {!p.active && <span className="tag">{t.inactive}</span>}
          </div>
        </div>
        <div className="jstats">
          <div className="jgrid">
            <div><b>{st.pj}</b><small>{t.matches}</small></div>
            <div><b>{st.goals}{st.pen ? <em> ({st.pen})</em> : null}</b><small>{t.goalsPen}</small></div>
            <div><b>{st.assists}</b><small>{t.assistsFull}</small></div>
            {gk && <div><b>{st.conceded}</b><small>{t.conceded}</small></div>}
            <div><b>{st.yellows}</b><small><span className="cardico y" />{t.yellowsFull}</small></div>
            <div className={st.reds ? "warn" : ""}><b>{st.reds}</b><small><span className="cardico r" />{t.redsFull}</small></div>
          </div>

          {c.sanctions.length > 0 && (
            <>
              <h2 className="h-sec rule" style={{ marginTop: 28 }}>{t.sanctionsHist}</h2>
              <div className="scroll"><table className="tbl" style={{ minWidth: 420 }}>
                <thead><tr><th className="l">{t.reason}</th><th>{t.md}</th><th>{t.matches}</th><th className="r">{t.remaining}</th></tr></thead>
                <tbody>{c.sanctions.map((s, i) => (
                  <tr key={i}><td className="l">{label(s.reason)}{s.notes ? ` — ${s.notes}` : ""}</td><td>{s.startRound ? `J${s.startRound}` : "—"}</td><td>{s.matches}</td><td className="r">{s.remaining > 0 ? <b style={{ color: "var(--card-red)" }}>{s.remaining}</b> : 0}</td></tr>
                ))}</tbody>
              </table></div>
            </>
          )}

          <h2 className="h-sec rule" style={{ marginTop: 28 }}>{t.matches}</h2>
          {hist.length === 0 ? <p style={{ color: "var(--muted)" }}>{t.noMatches}</p> : (
            <div className="scroll"><table className="tbl" style={{ minWidth: 560 }}>
              <thead><tr><th className="l">{t.md}</th><th className="l">{t.match}</th><th>{t.g}</th><th>{t.a}</th><th>{t.yc}</th><th>{t.rc}</th>{gk && <th>{t.concededShort}</th>}</tr></thead>
              <tbody>{hist.map((m) => {
                const mine = (x: { id: number }) => x.id === team.id;
                const fin = m.status === "played" || m.status === "walkover";
                return (
                  <tr key={m.id}>
                    <td className="l" style={{ whiteSpace: "nowrap" }}><b>J{m.round}</b> <span style={{ color: "var(--muted)" }}>{fmtDate(lang, m.date).short}</span></td>
                    <td className="l">
                      <a href={`${LEAGUE_URL}/partit/${m.id}`} target="_blank" rel="noopener" className="jm">
                        <span className={mine(m.home) ? "me" : ""}><Badge team={m.home} size={22} dark={mine(m.home)} />{m.home.name}</span>
                        <b className="sc">{fin ? `${m.homeGoals}–${m.awayGoals}` : "–"}</b>
                        <span className={mine(m.away) ? "me" : ""}>{m.away.name}<Badge team={m.away} size={22} dark={mine(m.away)} /></span>
                      </a>
                      {m.sub && <span style={{ color: "var(--muted)", fontSize: 12 }}> · {t.sub}</span>}
                    </td>
                    <td style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 18, color: "var(--green-dark)" }}>{m.goals ? `${m.goals}${m.pen ? ` (${m.pen})` : ""}` : ""}{m.missedPen ? <span title={t.missedPen} style={{ color: "var(--card-red)", fontSize: 13, marginLeft: 4 }}>✕{m.missedPen > 1 ? m.missedPen : ""}</span> : null}</td>
                    <td>{m.assists || ""}</td>
                    <td>{m.yellows ? Array.from({ length: m.yellows }).map((_, i) => <span key={i} className="cardico y" />) : ""}</td>
                    <td>{m.reds ? Array.from({ length: m.reds }).map((_, i) => <span key={i} className="cardico r" />) : ""}</td>
                    {gk && <td>{m.conceded ?? ""}</td>}
                  </tr>
                );
              })}</tbody>
            </table></div>
          )}
        </div>
      </section>
    </main>
  );
}
