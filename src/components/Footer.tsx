import { CLUB, SPONSORS_MAIN, SPONSORS_PARTNERS, type Sponsor } from "@/content/club";
import type { Dict } from "@/lib/i18n";

export function Sponsors({ t }: { t: Dict }) {
  const ph = (n: number) => Array.from({ length: n }, (_, i) => ({ name: t.sponsorPlaceholder, ph: true, key: i }));
  const main = SPONSORS_MAIN.length ? SPONSORS_MAIN : ph(3);
  const partners = SPONSORS_PARTNERS.length ? SPONSORS_PARTNERS : ph(4);
  const Item = ({ s }: { s: Sponsor & { ph?: boolean } }) => {
    const inner = s.logo ? <img src={s.logo} alt={s.name} /> : s.name;
    const cls = `sp${s.ph ? " ph" : ""}`;
    return s.url ? <a className={cls} href={s.url} target="_blank" rel="noopener sponsored">{inner}</a> : <div className={cls}>{inner}</div>;
  };
  return (
    <section className="sponsors">
      <div className="wrap">
        <div className="grp">
          <div className="lbl">{t.mainSponsors}</div>
          <div className="row">{main.map((s, i) => <Item key={i} s={s} />)}</div>
        </div>
        <div className="sep" />
        <div className="grp">
          <div className="lbl">{t.partners}</div>
          <div className="row sm">{partners.map((s, i) => <Item key={i} s={s} />)}</div>
        </div>
      </div>
    </section>
  );
}

export default function Footer({ t, leagueUrl, leagueHost, logo }: { t: Dict; leagueUrl: string; leagueHost: string; logo: string | null }) {
  const all = [...SPONSORS_MAIN, ...SPONSORS_PARTNERS];
  const soc = [["IG", CLUB.social.instagram], ["FB", CLUB.social.facebook], ["X", CLUB.social.x], ["YT", CLUB.social.youtube]].filter(([, u]) => u);
  return (
    <footer className="foot">
      <div className="wrap cols">
        <div className="c1">
          <div className="brand">
            <span className="crest">{logo ? <img src={logo} alt="" /> : <span>{CLUB.initials}</span>}</span>
            <span><span className="n1">{CLUB.shortName}<br />Veterans</span></span>
          </div>
          <p>{CLUB.address.map((l, i) => <span key={i}>{l}<br /></span>)}</p>
        </div>
        {(CLUB.email || CLUB.phone) && (
          <div className="c">
            <div className="fl">{t.contact}</div>
            {CLUB.email && <a href={`mailto:${CLUB.email}`}>{CLUB.email}</a>}
            {CLUB.phone && <a href={`tel:${CLUB.phone.replace(/\s/g, "")}`}>{CLUB.phone}</a>}
          </div>
        )}
        {soc.length > 0 && (
          <div className="c">
            <div className="fl">{t.followUs}</div>
            <div className="soc">{soc.map(([k, u]) => <a key={k} href={u} target="_blank" rel="noopener">{k}</a>)}</div>
          </div>
        )}
      </div>
      {all.length > 0 && (
        <div className="wrap"><div className="strip">{all.map((s, i) => <span key={i}>{s.name}</span>)}</div></div>
      )}
      <div className="wrap bottom">
        <a href={leagueUrl} target="_blank" rel="noopener">{t.officialFooter}: {leagueHost}</a>
        <span>© {new Date().getFullYear()} {CLUB.name}</span>
      </div>
    </footer>
  );
}
