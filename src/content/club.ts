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
  founded: null as number | null, // e.g. 2011
  ground: "Camp Municipal de Fogars de la Selva",
  address: ["Camp Municipal de Futbol", "Fogars de la Selva (Girona)"],
  colors: ["Blanco y verde", "Blanc i verd", "White and green"] as Tri,
  email: "" /* info@cffogars.com */,
  phone: "" /* +34 ... */,
  social: { instagram: "", facebook: "", x: "", youtube: "" },
  /** /public/images/... */
  heroPhoto: "/images/hero.jpg" as string | null,
  historyPhoto: null as string | null,
};

/** History page paragraphs. First one is rendered large. */
export const STORY: Tri[] = [
  [
    "El CF Fogars Veterans es el equipo de veteranos de Fogars de la Selva. Competimos en la Liga de Veteranos de Girona y jugamos nuestros partidos en el Campo Municipal.",
    "El CF Fogars Veterans és l'equip de veterans de Fogars de la Selva. Competim a la Lliga de Veterans de Girona i juguem els nostres partits al Camp Municipal.",
    "CF Fogars Veterans is the veterans' team of Fogars de la Selva. We play in the Girona Veterans League and host our matches at the Municipal ground.",
  ],
  [
    "El objetivo es el mismo cada temporada: competir cada sábado, respetar al rival y hacer piña en el tercer tiempo.",
    "L'objectiu és el mateix cada temporada: competir cada dissabte, respectar el rival i fer pinya al tercer temps.",
    "The goal is the same every season: compete every Saturday, respect the opponent and stick together at the third half.",
  ],
];

/** Timeline: year, title, text. Empty → section hidden. */
export const TIMELINE: { y: string; title: Tri; text: Tri }[] = [];

/** Honours: big number, label, detail. Empty → section hidden. */
export const PALMARES: { n: string; label: Tri; sub: string }[] = [];

export type Sponsor = { name: string; url?: string; logo?: string /* /images/sponsors/x.png */ };
export const SPONSORS_MAIN: Sponsor[] = [];
export const SPONSORS_PARTNERS: Sponsor[] = [];
