"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type T = Record<"name" | "message" | "captcha" | "help" | "send" | "sending" | "thanks" | "errCaptcha" | "errRate" | "errInvalid" | "errGeneric" | "newCaptcha" | "login" | "register" | "logout" | "nick" | "pass" | "hint" | "signedAs" | "guest" | "errNick" | "errPass" | "errTaken" | "errLogin", string>;
type Me = { nick: string; player: string | null; status: string | null } | null;

export default function Guestbook({ lang, t, me }: { lang: string; t: T; me: Me }) {
  const router = useRouter();
  const [cap, setCap] = useState<{ question: string; token: string } | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "ok">("idle");
  const [err, setErr] = useState("");
  const [mode, setMode] = useState<"post" | "login" | "register">("post");
  const loadedAt = useRef(Date.now());
  const form = useRef<HTMLFormElement>(null);
  const refresh = async () => { try { const r = await fetch("/api/guestbook?captcha", { cache: "no-store" }); setCap(await r.json()); } catch { setCap(null); } };
  useEffect(() => { refresh(); }, []);
  const errText = (e: string) => ({ captcha: t.errCaptcha, rate: t.errRate, invalid: t.errInvalid, nick: t.errNick, pass: t.errPass, taken: t.errTaken, login: t.errLogin } as Record<string, string>)[e] ?? t.errGeneric;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget); setState("busy"); setErr("");
    try {
      let r: Response;
      if (mode === "post") {
        r = await fetch("/api/guestbook", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: fd.get("name"), message: fd.get("message"), answer: fd.get("answer"), website: fd.get("website"), token: cap?.token, lang, ts: String(loadedAt.current) }) });
      } else {
        r = await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: mode, nick: fd.get("nick"), pass: fd.get("pass"), answer: fd.get("answer"), token: cap?.token }) });
      }
      const j = await r.json();
      if (!r.ok) { setErr(errText(j.error)); setState("idle"); refresh(); return; }
      if (mode === "post") { setState("ok"); form.current?.reset(); refresh(); router.refresh(); }
      else { setState("idle"); setMode("post"); router.refresh(); }
    } catch { setErr(t.errGeneric); setState("idle"); }
  };
  const logout = async () => { await fetch("/api/auth", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "logout" }) }); router.refresh(); };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="gbacct">
        {me ? (
          <><span>{t.signedAs} <b>{me.nick}</b>{me.player && <span className="pl"> · {me.player}</span>}{me.status && <span className="st">{me.status}</span>}</span><button type="button" onClick={logout}>{t.logout}</button></>
        ) : (
          <><span>{t.hint}</span><span className="btns"><button type="button" className={mode === "login" ? "on" : ""} onClick={() => setMode(mode === "login" ? "post" : "login")}>{t.login}</button><button type="button" className={mode === "register" ? "on" : ""} onClick={() => setMode(mode === "register" ? "post" : "register")}>{t.register}</button></span></>
        )}
      </div>
      <form ref={form} className="gbform" onSubmit={submit} style={{ position: "relative" }}>
        {mode === "post" ? (
          <>
            {!me && <label>{t.name}<input name="name" required minLength={2} maxLength={60} autoComplete="name" /></label>}
            <label>{t.message}<textarea name="message" required minLength={3} maxLength={1500} /></label>
            <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </>
        ) : (
          <>
            <label>{t.nick}<input name="nick" required minLength={2} maxLength={24} autoComplete="username" /></label>
            <label>{t.pass}<input name="pass" type="password" required minLength={6} autoComplete={mode === "register" ? "new-password" : "current-password"} /></label>
          </>
        )}
        {(mode === "register" || (mode === "post" && !me)) && (
          <label>{t.captcha}<span className="cap"><span>{t.help} {cap?.question ?? "…"} ?</span><input name="answer" required inputMode="numeric" pattern="[0-9]*" autoComplete="off" /><button type="button" onClick={refresh}>{t.newCaptcha}</button></span></label>
        )}
        {err && <div className="msg err">{err}</div>}
        {state === "ok" && <div className="msg ok">{t.thanks}</div>}
        <button className="submit" type="submit" disabled={state === "busy"}>{state === "busy" ? t.sending : mode === "post" ? t.send : mode === "login" ? t.login : t.register}</button>
      </form>
    </div>
  );
}
