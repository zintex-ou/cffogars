import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { isLang, t as dict } from "@/lib/i18n";
import { listEntriesFull, userFromCookie } from "@/lib/guestbook";
import { getFeed, displayName } from "@/lib/league";
import Guestbook from "./Guestbook";

export const dynamic = "force-dynamic";

export default async function Llibre({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const user = userFromCookie((await cookies()).get("gbu")?.value);
  const feed = await getFeed();
  const players = new Map((feed?.squad ?? []).map((p) => [p.id, { name: displayName(p), dorsal: p.dorsal }]));
  const entries = listEntriesFull();
  const me = user ? { nick: user.nick, player: user.player_id ? players.get(user.player_id)?.name ?? null : null, status: user.status } : null;
  const T = { name: t.gbName, message: t.gbMessage, captcha: t.gbCaptcha, help: t.gbCaptchaHelp, send: t.gbSend, sending: t.gbSending, thanks: t.gbThanks, errCaptcha: t.gbErrCaptcha, errRate: t.gbErrRate, errInvalid: t.gbErrInvalid, errGeneric: t.gbErrGeneric, newCaptcha: t.gbNewCaptcha,
    login: t.gbLogin, register: t.gbRegister, logout: t.gbLogout, nick: t.gbNick, pass: t.gbPass, hint: t.gbAccountHint, signedAs: t.gbSignedAs, guest: t.gbGuest, errNick: t.gbErrNick, errPass: t.gbErrPass, errTaken: t.gbErrTaken, errLogin: t.gbErrLogin };
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.gbKicker}</div><h1 className="h-page">{t.gbTitle}</h1></div>
      </div></section>
      <section className="wrap section" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,72px)" }}>
        <div style={{ flex: "1 1 340px", maxWidth: 520 }}>
          <p style={{ margin: "0 0 18px", fontSize: 18, color: "var(--ink-2)" }}>{t.gbIntro}</p>
          <Guestbook lang={lang} t={T} me={me} />
        </div>
        <div style={{ flex: "1.4 1 420px", minWidth: 0 }}>
          <div className="gbl" id="entries">
            {entries.length === 0 && <p style={{ color: "var(--muted)" }}>{t.gbEmpty}</p>}
            {entries.map((e) => {
              const pl = e.player_id ? players.get(e.player_id) : null;
              return (
                <div key={e.id} className={`gbe${e.user_id ? " reg" : ""}`}>
                  <div className="who">
                    <span className="nm"><b>{e.nick ?? e.name}</b>{pl && <span className="pl">{pl.dorsal != null ? `#${pl.dorsal} ` : ""}{pl.name}</span>}{e.status && <span className="st">{e.status}</span>}</span>
                    <span>{e.created_at.slice(0, 10).split("-").reverse().join("/")}</span>
                  </div>
                  <p>{e.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
