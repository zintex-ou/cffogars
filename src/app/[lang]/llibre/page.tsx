import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { listEntries } from "@/lib/guestbook";
import Guestbook from "./Guestbook";

export const dynamic = "force-dynamic";

export default async function Llibre({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  const entries = listEntries();
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.gbKicker}</div><h1 className="h-page">{t.gbTitle}</h1></div>
      </div></section>
      <section className="wrap section" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,72px)" }}>
        <div style={{ flex: "1 1 340px", maxWidth: 520 }}>
          <p style={{ margin: "0 0 18px", fontSize: 18, color: "var(--ink-2)" }}>{t.gbIntro}</p>
          <Guestbook lang={lang} t={{ name: t.gbName, message: t.gbMessage, captcha: t.gbCaptcha, help: t.gbCaptchaHelp, send: t.gbSend, sending: t.gbSending, thanks: t.gbThanks, errCaptcha: t.gbErrCaptcha, errRate: t.gbErrRate, errInvalid: t.gbErrInvalid, errGeneric: t.gbErrGeneric, newCaptcha: t.gbNewCaptcha }} />
        </div>
        <div style={{ flex: "1.4 1 420px", minWidth: 0 }}>
          <div className="gbl" id="entries">
            {entries.length === 0 && <p style={{ color: "var(--muted)" }}>{t.gbEmpty}</p>}
            {entries.map((e) => (
              <div key={e.id} className="gbe">
                <div className="who"><b>{e.name}</b><span>{e.created_at.slice(0, 10).split("-").reverse().join("/")}</span></div>
                <p>{e.message}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
