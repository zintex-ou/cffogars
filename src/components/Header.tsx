"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LANGS, type Lang, type Dict } from "@/lib/i18n";

export const NAV: { key: keyof Dict; path: string }[] = [
  { key: "home", path: "" },
  { key: "history", path: "/historia" },
  { key: "team", path: "/equip" },
  { key: "fixtures", path: "/calendari" },
  { key: "results", path: "/resultats" },
  { key: "league", path: "/lliga" },
  { key: "videos", path: "/videos" },
  { key: "guestbookNav", path: "/llibre" },
];

export default function Header({ lang, t, leagueUrl, leagueHost, logo, name, initials }: { lang: Lang; t: Dict; leagueUrl: string; leagueHost: string; logo: string | null; name: string; initials: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/[a-z]{2}/, "");
  const active = (p: string) => (p === "" ? rest === "" || rest === "/" : rest.startsWith(p));
  const [n1, ...n2] = name.split(" Veterans");
  return (
    <header>
      <div className="topbar">
        <div className="wrap">
          <a href={leagueUrl} target="_blank" rel="noopener">{t.officialFooter}</a>
          <div className="lang">
            {LANGS.map((l) => (
              <Link key={l} href={`/${l}${rest}`} className={l === lang ? "on" : ""} hrefLang={l}>{l.toUpperCase()}</Link>
            ))}
          </div>
        </div>
      </div>
      <div className={`mainbar${open ? " open" : ""}`}>
        <div className="wrap">
          <Link href={`/${lang}`} className="brand" onClick={() => setOpen(false)}>
            <span className="crest">{logo ? <img src={logo} alt="" /> : <span>{initials}</span>}</span>
            <span>
              <span className="n1">{n1}</span>
              {n2.length > 0 && <span className="n2">Veterans</span>}
            </span>
          </Link>
          <nav className="nav" aria-label="Principal">
            {NAV.map((n) => (
              <Link key={n.key} href={`/${lang}${n.path}`} className={active(n.path) ? "on" : ""}>{t[n.key]}</Link>
            ))}
          </nav>
          <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
        <nav className="mnav" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.key} href={`/${lang}${n.path}`} className={active(n.path) ? "on" : ""} onClick={() => setOpen(false)}>{t[n.key]}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
