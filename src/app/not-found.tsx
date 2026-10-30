import Link from "next/link";
export default function NotFound() {
  return (
    <main className="wrap section" style={{ textAlign: "center" }}>
      <h1 className="h-page" style={{ color: "var(--green)" }}>404</h1>
      <p><Link href="/ca">CF Fogars Veterans →</Link></p>
    </main>
  );
}
