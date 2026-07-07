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

  useEffect(() => {
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
      className="transition-colors ease-out"
      style={{
        color: active ? "#F2ECE2" : "#544c40",
        transitionDuration: "600ms",
      }}
    >
      {children}
    </p>
  );
}
