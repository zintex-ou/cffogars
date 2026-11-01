/** Club-site-only crest overrides for teams without a crest in the league DB. Key: regex on team slug/name. */
export const CREST_OVERRIDES: [RegExp, string][] = [
  [/amura/i, "/images/crests/amura.png"],
];
export const localCrest = (t: { slug: string; name: string }) => CREST_OVERRIDES.find(([re]) => re.test(t.slug) || re.test(t.name))?.[1] ?? null;
