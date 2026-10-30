/**
 * Match videos (Veo links). Newest first. `thumb` is an image in /public/images/videos/ (optional).
 * Example: { title: "CF Fogars 5–2 Esportiu Bonmatí", date: "2026-10-24", url: "https://app.veo.co/matches/...", thumb: "/images/videos/j8.jpg" }
 */
export type Video = { title: string; date: string; url: string; thumb?: string };
export const VIDEOS: Video[] = [];
