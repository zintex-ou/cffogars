/** Read-only feed from the league site (lliga). Revalidated every 5 minutes. */

export const LEAGUE_URL = (process.env.LEAGUE_URL ?? "https://lliga.cffogars.com").replace(/\/$/, "");
export const LEAGUE_API_URL = (process.env.LEAGUE_API_URL ?? LEAGUE_URL).replace(/\/$/, "");
export const LEAGUE_HOST = LEAGUE_URL.replace(/^https?:\/\//, "");
export const TEAM_SLUG = process.env.TEAM_SLUG ?? "cf-fogars-veterans";

export type TeamInfo = { id: number; name: string; slug: string; short: string | null; logo: string | null; town: string | null; field: string | null };
export type GoalEvent = { type: "gol" | "gol_pen"; minute: number | null; player: string | null; playerShort?: string | null; playerId: number | null; assist: string | null; assistShort?: string | null; assistId?: number | null; team: "mine" | "other" };
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

export type PlayerHistory = {
  id: number; round: number; date: string; home: TeamInfo; away: TeamInfo; homeGoals: number | null; awayGoals: number | null; status: string;
  goals: number; pen: number; missedPen: number; assists: number; yellows: number; reds: number; sub: boolean; conceded: number | null;
};
export type PlayerCard = {
  player: { id: number; name: string; surname: string; position: string; dorsal: number | null; photo: string | null; age: number | null; active: boolean };
  team: TeamInfo;
  stats: { pj: number; goals: number; pen: number; assists: number; yellows: number; reds: number; conceded: number; suspended: number };
  sanctions: { reason: string; matches: number; remaining: number; startRound: number | null; notes: string | null }[];
  history: PlayerHistory[];
};
export async function getPlayer(id: number): Promise<PlayerCard | null> {
  if (!Number.isFinite(id)) return null;
  try {
    const res = await fetch(`${LEAGUE_API_URL}/api/public/player/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as PlayerCard;
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
/** Goals scored by our players, grouped by scorer, with per-goal details for rendering links. */
export type ScorerGoal = { minute: number | null; pen: boolean; assist: { id: number | null; name: string } | null };
export type Scorer = { id: number | null; name: string; goals: ScorerGoal[] };
export function myScorers(m: Match): Scorer[] {
  const out: Scorer[] = [];
  for (const e of m.events) {
    if (e.team !== "mine" || !e.player) continue;
    const nm = e.playerShort ?? shortName(e.player);
    let s = out.find((x) => x.name === nm);
    if (!s) { s = { id: e.playerId, name: nm, goals: [] }; out.push(s); }
    s.goals.push({ minute: e.minute, pen: e.type === "gol_pen", assist: e.assist ? { id: e.assistId ?? null, name: e.assistShort ?? shortName(e.assist) } : null });
  }
  return out;
}
export const playerUrl = (id: number | null, lang?: string) => (id ? (lang ? `/${lang}/jugador/${id}` : `${LEAGUE_URL}/jugador/${id}`) : null);
/** "Miquel Ballesté Da Silva" → "M. Ballesté" */
export const shortName = (full: string) => { const p = full.trim().split(/\s+/); return p.length > 1 ? `${p[0][0]}. ${p[1]}` : full; };
export const initials = (t: TeamInfo) => t.short?.slice(0, 3).toUpperCase() ?? t.name.split(/\s+/).filter((w) => /^[A-ZÀ-Ü]/.test(w)).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
export const mapUrl = (field: string | null, town?: string | null) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([field, town].filter(Boolean).join(", "))}`;
export const leagueAsset = (p: string | null) => (p ? `${LEAGUE_URL}${p}` : null);
export const matchUrl = (m: Match) => `${LEAGUE_URL}/partit/${m.id}`;
export const displayName = (p: Player) => `${p.name} ${p.surname}`.trim();
