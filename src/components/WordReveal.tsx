"use client";

import { useEffect, useRef, useState } from "react";

export type RevealWord = { text: string; strike?: boolean };

/**
 * A sentence that reveals word by word (blur -> sharp, dim -> bright) as the
 * block scrolls up through the viewport, continuously tied to scroll
 * position rather than a one-shot trigger. A word can be marked `strike` to
 * stay permanently struck through, independent of reveal progress — used to
 * visually reject a phrase mid-sentence.
 */
export function WordReveal({ words, className }: { words: RevealWord[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function update() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const start = viewportH * 0.9;
      const end = viewportH * 0.35;
      const raw = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, raw)));
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeCount = Math.round(progress * words.length);

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => {
        const active = i < activeCount;
        return (
          <span
            key={i}
            style={{
              color: active ? "#F2ECE2" : "#4a4136",
              filter: active ? "blur(0px)" : "blur(4px)",
              transition: "color 250ms ease-out, filter 250ms ease-out",
              textDecorationLine: word.strike ? "line-through" : "none",
              textDecorationColor: "#7a6f5f",
            }}
          >
            {word.text}{" "}
          </span>
        );
      })}
    </p>
  );
}
