import { notFound } from "next/navigation";
import { isLang, t as dict } from "@/lib/i18n";
import { CLUB } from "@/content/club";
import ContactForm from "./ContactForm";

export default async function Contacte({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = dict(lang);
  return (
    <main>
      <section className="page-hero"><div className="wrap">
        <div><div className="kicker">{t.contactKicker}</div><h1 className="h-page">{t.contactTitle}</h1></div>
      </div></section>
      <section className="wrap section" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(32px,5vw,72px)" }}>
        <div style={{ flex: "1 1 320px", maxWidth: 560 }}>
          <p style={{ margin: "0 0 18px", fontSize: 18, color: "var(--ink-2)" }}>{t.contactIntro}</p>
          <ContactForm lang={lang} t={{ name: t.gbName, email: t.contactEmail, message: t.gbMessage, captcha: t.gbCaptcha, help: t.gbCaptchaHelp, send: t.contactSend, sending: t.gbSending, thanks: t.contactThanks, errCaptcha: t.gbErrCaptcha, errRate: t.gbErrRate, errInvalid: t.gbErrInvalid, errGeneric: t.gbErrGeneric, newCaptcha: t.gbNewCaptcha }} />
        </div>
        <div style={{ flex: "1 1 260px" }}>
          <div className="fitxa">
            <b style={{ color: "var(--green-dark)" }}>{CLUB.name}</b>
            <div><span>{t.ground}</span><b>{CLUB.ground}</b></div>
            {CLUB.email && <div><span>Email</span><a href={`mailto:${CLUB.email}`}>{CLUB.email}</a></div>}
            {CLUB.phone && <div><span>Tel.</span><a href={`tel:${CLUB.phone.replace(/\s/g, "")}`}>{CLUB.phone}</a></div>}
          </div>
        </div>
      </section>
    </main>
  );
}
