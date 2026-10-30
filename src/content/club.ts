/**
 * Club content you edit by hand (history, sponsors, contacts).
 * Every text field is [es, ca, en]. Leave an array empty to hide its section.
 */
import type { Lang } from "@/lib/i18n";

export type Tri = [string, string, string];
const IDX: Record<Lang, number> = { es: 0, ca: 1, en: 2 };
export const pick = (lang: Lang, x: Tri | string) => (typeof x === "string" ? x : x[IDX[lang]]);

export const CLUB = {
  name: "CF Fogars Veterans",
  shortName: "CF Fogars",
  initials: "CFV",
  town: "Fogars de la Selva",
  founded: 2023 as number | null,
  ground: "Camp Municipal de Fogars de la Selva",
  address: ["Camp Municipal de Futbol", "Fogars de la Selva (Girona)"],
  colors: ["Blanco y verde", "Blanc i verd", "White and green"] as Tri,
  email: "" /* info@cffogars.com */,
  phone: "" /* +34 ... */,
  social: { instagram: "", facebook: "", x: "", youtube: "" },
  /** /public/images/... */
  heroPhoto: "/images/hero.jpg" as string | null,
  historyPhoto: null as string | null,
  groundPhoto: "/images/ground.jpg" as string | null,
};

/** History page paragraphs. First one is rendered large. */
export const STORY: Tri[] = [
  [
    "El CF Fogars Veterans se formó en 2023. Las primeras temporadas el equipo compitió con el nombre de Palafolls y en la temporada 2024-25 se trasladó a Fogars de la Selva, donde ha seguido creciendo.",
    "El CF Fogars Veterans es va formar l'any 2023. Les primeres temporades l'equip va competir amb el nom de Palafolls i la temporada 2024-25 es va traslladar a Fogars de la Selva, on ha continuat creixent.",
    "CF Fogars Veterans was formed in 2023. In its first seasons the team competed under the name Palafolls, and in 2024-25 it moved to Fogars de la Selva, where it has kept growing.",
  ],
  [
    "Jugamos en la Liga de Veteranos de Girona y disputamos los partidos de casa en el Campo Municipal de Fogars.",
    "Juguem a la Lliga de Veterans de Girona i disputem els partits de casa al Camp Municipal de Fogars.",
    "We play in the Girona Veterans League and host our home matches at the Fogars Municipal ground.",
  ],
];

/** Timeline: year, title, text. Empty → section hidden. */
export const TIMELINE: { y: string; title: Tri; text: Tri }[] = [];

/** Honours: big number, label, detail. Empty → section hidden. */
export const PALMARES: { n: string; label: Tri; sub: string }[] = [
  { n: "2n", label: ["Torneo de Maçanet", "Torneig de Maçanet", "Maçanet Tournament"], sub: "2025" },
  { n: "2n", label: ["Torneo de Castell d'Aro", "Torneig de Castell d'Aro", "Castell d'Aro Tournament"], sub: "2023" },
];

/** Club staff not in the league DB (role keys: entrenador, segon, president, fisio, delegat). Delegates come from the league automatically. */
export const STAFF: { name: string; role: string; photo?: string }[] = [
  { name: "Ievgen Zinchenko", role: "president" },
  { name: "Viktor Tiurin", role: "director" },
  { name: "Oleksandr Padaliuk", role: "entrenador" },
];

export type Sponsor = { name: string; url?: string; logo?: string /* /images/sponsors/x.png */ };
export const SPONSORS_MAIN: Sponsor[] = [
  { name: "Mesón El Cid", logo: "/images/sponsors/elcid.svg" },
  { name: "Unspace", logo: "/images/sponsors/unspace.png", url: "https://unspace.app" },
  { name: "Advision", logo: "/images/sponsors/advision.png" },
];
export const SPONSORS_PARTNERS: Sponsor[] = [];
