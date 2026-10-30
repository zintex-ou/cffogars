import { notFound } from "next/navigation";
import { isLang, t as dict, posLabel, POS_ORDER } from "@/lib/i18n";
import { getFeed, leagueAsset, displayName } from "@/lib/league";
import { NoData } from "@/components/league";
import SquadGrid from "./SquadGrid";

export default async function Equip({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  if (!feed) return <NoData t={t} />;
  const squad = [...feed.squad].sort((a, b) => POS_ORDER.indexOf(a.position) - POS_ORDER.indexOf(b.position) || (a.dorsal ?? 999) - (b.dorsal ?? 999) || a.surname.localeCompare(b.surname));
  const players = squad.map((p) => ({ ...p, photo: leagueAsset(p.photo), posLabel: posLabel(lang, p.position) }));
  const stats = [...squad].sort((a, b) => b.goals - a.goals || b.assists - a.assists || b.pj - a.pj);
  const chips = ["all", ...POS_ORDER].map((k) => ({ k, label: k === "all" ? t.all : posLabel(lang, k) }));
  return (
    <main>
      <SquadGrid t={t} season={feed.season} players={players} chips={chips} />
      <section className="wrap" style={{ paddingBottom: "clamp(56px,7vw,104px)" }}>
        <h2 className="h-sec rule">{t.stats}</h2>
        <div className="scroll">
          <table className="tbl" style={{ minWidth: 620 }}>
            <thead><tr><th className="l">#</th><th className="l">{t.player}</th><th className="l">{t.position}</th><th>{t.apps}</th><th>{t.g}</th><th>{t.a}</th><th>{t.yc}</th><th>{t.rc}</th></tr></thead>
            <tbody>
              {stats.map((p) => (
                <tr key={p.id}>
                  <td className="l" style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 20, color: "var(--green)" }}>{p.dorsal ?? ""}</td>
                  <td className="l" style={{ fontWeight: 600 }}>{displayName(p)}{p.suspended > 0 && <span className="tag" style={{ marginLeft: 8, background: "var(--card-red)", color: "#fff", fontSize: 11 }}>{t.suspended}</span>}</td>
                  <td className="l" style={{ color: "var(--muted)" }}>{posLabel(lang, p.position)}</td>
                  <td>{p.pj}</td>
                  <td style={{ fontFamily: "Barlow Condensed", fontWeight: 800, fontSize: 20, color: "var(--green-dark)" }}>{p.goals}</td>
                  <td>{p.assists}</td><td>{p.yellows}</td><td>{p.reds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {feed.staff.length > 0 && (
        <section style={{ background: "var(--green-light)" }}><div className="wrap section">
          <h2 className="h-sec" style={{ marginBottom: 32, color: "var(--green-dark)" }}>{t.staff}</h2>
          <div className="staffgrid">
            {feed.staff.map((m, i) => <div key={i} className="scard"><div className="info"><div className="role">{m.role}</div><div className="nm">{m.name}</div></div></div>)}
          </div>
        </div></section>
      )}
    </main>
  );
}
