/** Club-site player portraits (/public/images/players). Key: lowercase fragment of "name surname" (accents stripped). */
const PORTRAITS: [string, string][] = [
  ["errouchani", "abdelaziz"], ["andreev", "andreev"], ["chaara", "chaara"], ["clarke", "clarke"], ["coloma", "coloma"],
  ["delgado", "delgado"], ["ezequiel", "ezequiel"], ["farafontov", "farafontov"], ["segui", "francisco"], ["franco rodriguez", "franco"],
  ["padaliuk", "padaliuk"], ["padaliuk", "hlot"], ["hlot", "padaliuk"], ["zinchenko", "ievgen"], ["jhoan", "jhoan"], ["karim", "karim"], ["lopez fernandez", "lopez"], ["miquel balleste", "miquel"],
  ["ortiz", "ortiz"], ["oscar balleste", "oscar"], ["reutsa", "reutsa"], ["rubanov", "rubanov"], ["stoiachenko", "stoiachenko"], ["tiurin", "tiurin"], ["zamora", "zamora"],
];
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
export function localPhoto(p: { name: string; surname: string }): string | null {
  const full = norm(`${p.name} ${p.surname}`);
  const hit = PORTRAITS.find(([k]) => full.includes(k));
  return hit ? `/images/players/${hit[1]}.jpg` : null;
}
