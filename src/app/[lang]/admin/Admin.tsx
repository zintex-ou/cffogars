"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type U = { id: number; nick: string; player_id: number | null; status: string | null; created_at: string };
type E = { id: number; name: string; message: string; created_at: string; nick: string | null };
type M = { id: number; name: string; email: string; message: string; created_at: string };

export default function Admin({ authed, users, entries, messages, players }: { authed: boolean; users: U[]; entries: E[]; messages: M[]; players: { id: number; label: string }[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const call = async (body: Record<string, unknown>) => {
    const r = await fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    setMsg(r.ok ? "✓" : "✗ " + ((await r.json()).error ?? r.status)); router.refresh();
  };
  if (!authed) {
    return (
      <form className="gbform" style={{ maxWidth: 420 }} onSubmit={(e) => { e.preventDefault(); call({ action: "login", token: new FormData(e.currentTarget).get("token") }); }}>
        <label>Admin token<input name="token" type="password" required /></label>
        {msg && <div className="msg err">{msg}</div>}
        <button className="submit" type="submit">Entrar</button>
      </form>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span className="msg ok">{msg}</span><button className="btn" onClick={() => call({ action: "logout" })}>Sortir</button></div>
      <div>
        <h2 className="h-sec rule">Usuaris</h2>
        <div className="scroll"><table className="tbl" style={{ minWidth: 640 }}>
          <thead><tr><th className="l">Nick</th><th className="l">Jugador</th><th className="l">Estat (frase sota el nom)</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="l" style={{ fontWeight: 700 }}>{u.nick}</td>
                <td className="l"><select id={`p${u.id}`} defaultValue={u.player_id ?? ""} style={{ font: "inherit", padding: 6 }}><option value="">—</option>{players.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></td>
                <td className="l"><input id={`s${u.id}`} defaultValue={u.status ?? ""} maxLength={60} style={{ font: "inherit", padding: 6, width: "100%" }} placeholder="p. ex. Rei del tercer temps" /></td>
                <td><button className="btn" onClick={() => call({ action: "user", id: u.id, playerId: (document.getElementById(`p${u.id}`) as HTMLSelectElement).value || null, status: (document.getElementById(`s${u.id}`) as HTMLInputElement).value })}>Desa</button></td>
              </tr>
            ))}
            {users.length === 0 && <tr><td className="l" colSpan={4} style={{ color: "var(--muted)" }}>Encara no hi ha usuaris registrats.</td></tr>}
          </tbody>
        </table></div>
      </div>
      <div>
        <h2 className="h-sec rule">Formulari de contacte</h2>
        <div className="gbl">
          {messages.length === 0 && <p style={{ color: "var(--muted)" }}>Cap missatge.</p>}
          {messages.map((m) => (
            <div key={m.id} className="gbe"><div className="who"><span className="nm"><b>{m.name}</b><a href={`mailto:${m.email}`} className="pl">{m.email}</a></span><span>{m.created_at.slice(0, 16)}</span></div><p>{m.message}</p></div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="h-sec rule">Llibre de visites</h2>
        <div className="gbl">
          {entries.map((e) => (
            <div key={e.id} className="gbe"><div className="who"><span className="nm"><b>{e.nick ?? e.name}</b></span><span>{e.created_at.slice(0, 16)} · <button style={{ border: 0, background: "none", color: "var(--red)", fontWeight: 700 }} onClick={() => { if (confirm("Amagar?")) call({ action: "hide", id: e.id }); }}>Amaga</button></span></div><p>{e.message}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}
