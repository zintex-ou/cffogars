"use client";
import { useState } from "react";
import type { Dict } from "@/lib/i18n";

const RATIO: Record<string, number> = { "0": 0.449, "1": 0.23, "2": 0.463, "3": 0.45, "4": 0.477, "5": 0.439, "6": 0.459, "7": 0.458, "8": 0.435, "9": 0.45 };
type P = { id: number; name: string; surname: string; position: string; posLabel: string; dorsal: number | null; photo: string | null; pj: number; goals: number; assists: number; yellows: number; reds: number; suspended: number };

export default function SquadGrid({ t, season, players, chips }: { t: Dict; season: string; players: P[]; chips: { k: string; label: string }[] }) {
  const [f, setF] = useState("all");
  const list = players.filter((p) => f === "all" || p.position === f);
  return (
    <>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.season} {season}</div><h1 className="h-page">{t.squad}</h1></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {chips.map((c) => <button key={c.k} className={`chip${f === c.k ? " on" : ""}`} onClick={() => setF(c.k)}>{c.label}</button>)}
        </div>
      </div></section>
      <section className="wrap section" style={{ paddingBottom: "clamp(40px,5vw,72px)" }}>
        <div className="pgrid">
          {list.map((p) => (
            <article key={p.id} className="pcard">
              <div className="ph" style={p.photo ? { backgroundImage: `url(${p.photo})` } : undefined}>
                {!p.photo && <span className="sil"><svg viewBox="0 0 100 90"><circle cx="50" cy="28" r="18" /><path d="M10 90c0-24 18-36 40-36s40 12 40 36z" /></svg></span>}
                {p.dorsal != null && <span className="num" aria-label={String(p.dorsal)}>{String(p.dorsal).split("").map((c, i) => <span key={i} className="dg" style={{ aspectRatio: String(RATIO[c] ?? 0.45), ["--m" as string]: `url(/numbers/${c}.svg)` }} />)}</span>}
                {p.suspended > 0 && <span className="tag susp">{t.suspended}</span>}
              </div>
              <div className="info">
                <div className="pl">{p.posLabel}</div>
                <div className="nm"><div className="f">{p.name}</div><div className="s">{p.surname}</div></div>
              </div>
              <div className="st">
                <div><b>{p.goals}</b><small>{t.g}</small></div>
                <div><b>{p.assists}</b><small>{t.a}</small></div>
                <div><b>{p.yellows}</b><small><span className="cardico y" />{t.yc}</small></div>
                <div><b>{p.reds}</b><small><span className="cardico r" />{t.rc}</small></div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
