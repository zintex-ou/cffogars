import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isLang, t as dict, LANGS } from "@/lib/i18n";
import { getFeed, LEAGUE_URL, LEAGUE_HOST, leagueAsset } from "@/lib/league";
import { CLUB } from "@/content/club";

export const revalidate = 300;
export function generateStaticParams() { return LANGS.map((lang) => ({ lang })); }

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const feed = await getFeed();
  const logo = "/logo.svg";
  return (
    <>
      <Header lang={lang} t={t} leagueUrl={LEAGUE_URL} leagueHost={LEAGUE_HOST} logo={logo} name={CLUB.name} initials={CLUB.initials} />
      {children}
      <Footer t={t} lang={lang} leagueUrl={LEAGUE_URL} leagueHost={LEAGUE_HOST} logo={logo} />
    </>
  );
}
