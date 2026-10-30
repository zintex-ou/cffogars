"use client";
import { useEffect } from "react";
/** Scrolls the next match row under the sticky header on first render. */
export default function ScrollToNext() {
  useEffect(() => {
    const el = document.getElementById("next-match");
    if (!el || window.location.hash) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 92;
    window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
  }, []);
  return null;
}
