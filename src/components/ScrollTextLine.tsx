"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A line of text that lights up from dim to bright once it scrolls into the
 * upper part of the viewport, and stays lit — the "reading highlight"
 * effect, not a toggle. Meant to be stacked, one line per sentence.
 */
export function ScrollTextLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setActive(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <p
      ref={ref}
      className={reducedMotion ? "" : "transition-colors ease-out"}
      style={{
        color: active ? "#F5F5F5" : "#525252",
        transitionDuration: reducedMotion ? "0ms" : "600ms",
      }}
    >
      {children}
    </p>
  );
}
