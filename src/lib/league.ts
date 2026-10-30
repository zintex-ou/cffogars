/** Read-only feed from the league site (lliga). Revalidated every 5 minutes. */

export const LEAGUE_URL = (process.env.LEAGUE_URL ?? "https://lliga.cffogars.com").replace(/\/$/, "");
export const LEAGUE_API_URL = (process.env.LEAGUE_API_URL ?? LEAGUE_URL).replace(/\/$/, "");
export const LEAGUE_HOST = LEAGUE_URL.replace(/^https?:\/\//, "");
export const TEAM_SLUG = process.env.TEAM_SLUG ?? "cf-fogars-veterans";

export type TeamInfo = { id: number; name: string; slug: string; short: string | null; logo: string | null; town: string | null; field: string | null };
export type GoalEvent = { type: "gol" | "gol_pen"; minute: number | null; player: string | null; playerId: number | null; assist: string | null; team: "mine" | "other" };
export type Match = {
  id: number; round: number; date: string; time: string | null; field: string | null;
  status: "scheduled" | "played" | "walkover" | "postponed" | "cancelled" | string; notes: string | null;
  home: TeamInfo; away: TeamInfo; homeGoals: number | null; awayGoals: number | null; events: GoalEvent[];
};
export type Row = { pos: number; team: TeamInfo; pj: number; w: number; d: number; l: number; gf: number; gc: number; dg: number; pts: number; form: ("W" | "D" | "L")[] };
export type Player = {
  id: number; name: string; surname: string; position: string; dorsal: number | null; photo: string | null;
  pj: number; goals: number; pen: number; assists: number; yellows: number; reds: number; suspended: number;
};
export type Staff = { name: string; role: string; phone: string | null; email: string | null };
export type Feed = {
  season: string; group: { id: number; name: string; topSlots: number; relegSlots: number };
  team: TeamInfo & { photo: string | null; colors: string | null; founded: number | null; info: string | null };
  lastMatch: Match | null; nextMatch: Match | null; matches: Match[]; standings: Row[]; squad: Player[]; staff: Staff[]; generatedAt: string;
};

export async function getFeed(): Promise<Feed | null> {
  try {
    const res = await fetch(`${LEAGUE_API_URL}/api/public/team/${TEAM_SLUG}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as Feed;
  } catch {
    return null;
  }
}

export const isMine = (f: Feed, m: Match) => m.home.id === f.team.id;
export const played = (m: Match) => m.status === "played" || m.status === "walkover";
export function outcome(f: Feed, m: Match): "W" | "D" | "L" | null {
  if (!played(m) || m.homeGoals == null || m.awayGoals == null) return null;
  const mine = isMine(f, m) ? m.homeGoals : m.awayGoals, other = isMine(f, m) ? m.awayGoals : m.homeGoals;
  return mine > other ? "W" : mine === other ? "D" : "L";
}
/** Goals scored by our players in a match, grouped by scorer: [{ name, mins: "24' 45'" }] */
export function myScorers(m: Match) {
  const out: { name: string; mins: string[] }[] = [];
  for (const e of m.events) {
    if (e.team !== "mine" || !e.player) continue;
    let s = out.find((x) => x.name === e.player);
    if (!s) { s = { name: e.player, mins: [] }; out.push(s); }
    s.mins.push(e.minute != null ? `${e.minute}'${e.type === "gol_pen" ? " (p)" : ""}` : e.type === "gol_pen" ? "(p)" : "");
  }
  return out.map((s) => ({ name: s.name, mins: s.mins.filter(Boolean).join(" ") || (s.mins.length > 1 ? `×${s.mins.length}` : "") }));
}
export const initials = (t: TeamInfo) => t.short?.slice(0, 3).toUpperCase() ?? t.name.split(/\s+/).filter((w) => /^[A-ZÀ-Ü]/.test(w)).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
export const mapUrl = (field: string | null, town?: string | null) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([field, town].filter(Boolean).join(", "))}`;
export const leagueAsset = (p: string | null) => (p ? `${LEAGUE_URL}${p}` : null);
export const matchUrl = (m: Match) => `${LEAGUE_URL}/partit/${m.id}`;
export const displayName = (p: Player) => `${p.name} ${p.surname}`.trim();
