import { VIDEOS as MANUAL, type Video } from "@/content/videos";

const CLUB = process.env.VEO_CLUB ?? "cf-fogars";
type VeoRec = { identifier: string; slug: string; title: string; start: string; created: string; privacy: string; thumbnail: string | null; url: string };

/** Public recordings of the club from app.veo.co (club privacy must be "public"). Cached 7 days (refreshed on deploy or weekly); falls back to the manual list. */
export async function getVideos(): Promise<Video[]> {
  try {
    const r = await fetch(`https://app.veo.co/api/app/clubs/${CLUB}/recordings/?filter=own&page_size=200`, { next: { revalidate: 7 * 24 * 3600, tags: ["veo"] }, headers: { accept: "application/json" } });
    if (!r.ok) throw new Error(String(r.status));
    const list = (await r.json()) as VeoRec[];
    const out = list.filter((v) => v.privacy === "public").map((v) => ({
      title: v.title.replace(/^Partido - /i, "").trim() || "CF Fogars",
      date: (v.start ?? v.created).slice(0, 10),
      url: `https://app.veo.co${v.url.startsWith("/") ? v.url : `/matches/${v.slug}/`}`,
      thumb: v.thumbnail ?? undefined,
    }));
    if (out.length) return out.sort((a, b) => b.date.localeCompare(a.date));
  } catch {}
  return [...MANUAL].sort((a, b) => b.date.localeCompare(a.date));
}
