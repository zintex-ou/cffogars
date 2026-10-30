"use client";
import { useEffect, useRef, useState } from "react";

type T = Record<"name" | "email" | "message" | "captcha" | "help" | "send" | "sending" | "thanks" | "errCaptcha" | "errRate" | "errInvalid" | "errGeneric" | "newCaptcha", string>;

export default function ContactForm({ lang, t }: { lang: string; t: T }) {
  const [cap, setCap] = useState<{ question: string; token: string } | null>(null);
  const [state, setState] = useState<"idle" | "busy" | "ok">("idle");
  const [err, setErr] = useState("");
  const loadedAt = useRef(Date.now());
  const form = useRef<HTMLFormElement>(null);
  const refresh = async () => { try { const r = await fetch("/api/guestbook?captcha", { cache: "no-store" }); setCap(await r.json()); } catch { setCap(null); } };
  useEffect(() => { refresh(); }, []);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); if (!cap) return;
    const fd = new FormData(e.currentTarget); setState("busy"); setErr("");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), message: fd.get("message"), answer: fd.get("answer"), website: fd.get("website"), token: cap.token, lang, ts: String(loadedAt.current) }) });
      const j = await r.json();
      if (!r.ok) { setErr(j.error === "captcha" ? t.errCaptcha : j.error === "rate" ? t.errRate : j.error === "invalid" ? t.errInvalid : t.errGeneric); setState("idle"); refresh(); return; }
      setState("ok"); form.current?.reset(); refresh();
    } catch { setErr(t.errGeneric); setState("idle"); }
  };
  return (
    <form ref={form} className="gbform" onSubmit={submit} style={{ position: "relative" }}>
      <label>{t.name}<input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
      <label>{t.email}<input name="email" type="email" required maxLength={120} autoComplete="email" /></label>
      <label>{t.message}<textarea name="message" required minLength={5} maxLength={3000} /></label>
      <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label>{t.captcha}<span className="cap"><span>{t.help} {cap?.question ?? "…"} ?</span><input name="answer" required inputMode="numeric" pattern="[0-9]*" autoComplete="off" /><button type="button" onClick={refresh}>{t.newCaptcha}</button></span></label>
      {err && <div className="msg err">{err}</div>}
      {state === "ok" && <div className="msg ok">{t.thanks}</div>}
      <button className="submit" type="submit" disabled={state === "busy" || !cap}>{state === "busy" ? t.sending : t.send}</button>
    </form>
  );
}
