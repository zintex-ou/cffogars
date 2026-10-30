import { notFound } from "next/navigation";
import { isLang, t as dict, posLabel, roleLabel, POS_ORDER } from "@/lib/i18n";
import { STAFF } from "@/content/club";
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
  const staff: { name: string; role: string; photo: string | null }[] = [];
  for (const s of [...STAFF.map((s) => ({ name: s.name, role: s.role, photo: s.photo ?? null })), ...feed.staff.map((s) => ({ name: s.name, role: s.role, photo: null }))]) {
    const ex = staff.find((x) => x.name.toLowerCase() === s.name.toLowerCase());
    if (ex) ex.role += ` · ${roleLabel(lang, s.role)}`; else staff.push({ name: s.name, role: roleLabel(lang, s.role), photo: s.photo });
  }
  const chips = ["all", ...POS_ORDER].map((k) => ({ k, label: k === "all" ? t.all : posLabel(lang, k) }));
  return (
    <main>
      <SquadGrid t={t} season={feed.season} players={players} chips={chips} />
      {staff.length > 0 && (
        <section style={{ background: "var(--green-light)" }}><div className="wrap" style={{ paddingTop: "clamp(32px,4vw,56px)", paddingBottom: "clamp(32px,4vw,56px)" }}>
          <h2 className="h-sec" style={{ marginBottom: 24, color: "var(--green-dark)" }}>{t.staff}</h2>
          <div className="staffgrid">
            {staff.map((m, i) => <div key={i} className="scard">{m.photo && <div style={{ aspectRatio: "1/1", backgroundImage: `url(${m.photo})`, backgroundSize: "cover" }} />}<div className="info"><div className="role">{m.role}</div><div className="nm">{m.name}</div></div></div>)}
          </div>
        </div></section>
      )}
      <section className="wrap" style={{ paddingTop: "clamp(32px,4vw,56px)", paddingBottom: "clamp(56px,7vw,104px)" }}>
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
    </main>
  );
}
