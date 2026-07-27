"use client";

import { useEffect, useRef, useState } from "react";

/** Fades a section in as it scrolls into view. No library — just IntersectionObserver. */
export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReducedMotion(true);
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionProperty: reducedMotion ? "none" : "opacity, transform",
        transitionDuration: reducedMotion ? "0ms" : "1100ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: reducedMotion ? "0ms" : `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible || reducedMotion ? "translateY(0)" : "translateY(14px)",
      }}
    >
      {children}
    </div>
  );
}
