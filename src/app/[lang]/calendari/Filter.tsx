"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Filter({ chips, current }: { chips: [string, string][]; current: string }) {
  const p = usePathname();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {chips.map(([k, label]) => <Link key={k} href={k === "all" ? p : `${p}?f=${k}`} className={`chip${current === k ? " on" : ""}`} scroll={false}>{label}</Link>)}
    </div>
  );
}
