"use client";

import { useEffect, useRef, useState } from "react";

export function GlossaryTerm({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <span className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="underline decoration-dotted decoration-accent/70 underline-offset-4 text-accent hover:decoration-solid"
      >
        {term}
      </button>
      {open ? (
        <span
          role="tooltip"
          className="toast-pop absolute z-40 top-full left-1/2 -translate-x-1/2 mt-2 w-64 max-w-[calc(100vw-2.5rem)] rounded-md border border-line bg-surface p-3 text-left shadow-2xl"
        >
          <span className="block text-[10px] uppercase tracking-widest text-accent mb-1">{term}</span>
          <span className="block text-xs leading-relaxed text-neutral-300">{definition}</span>
        </span>
      ) : null}
    </span>
  );
}
