"use client";

import { useEffect, useState } from "react";

const KEY = "ejecuta_density";

/** Personal display preference, not account data — lives in localStorage,
 * applied as a data-density attribute on <html> so globals.css can target
 * it with plain higher-specificity selectors (no new Tailwind layer
 * plumbing needed). The blocking script in layout.tsx sets this attribute
 * before first paint so there's no flash back to the normal spacing. */
export function DensityToggle() {
  const [compact, setCompact] = useState<boolean | null>(null);

  useEffect(() => {
    setCompact(document.documentElement.getAttribute("data-density") === "compact");
  }, []);

  function apply(next: boolean) {
    setCompact(next);
    if (next) {
      document.documentElement.setAttribute("data-density", "compact");
      localStorage.setItem(KEY, "compact");
    } else {
      document.documentElement.removeAttribute("data-density");
      localStorage.setItem(KEY, "cozy");
    }
  }

  // Avoid a mismatched flash between server render and the client's real
  // preference — render nothing until the attribute has been read once.
  if (compact === null) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-400">
        {compact ? "Menos aire, más contenido a la vez." : "Espaciado normal."}
      </p>
      <button type="button" onClick={() => apply(!compact)} className="btn-secondary text-xs py-2 px-4">
        {compact ? "Desactivar" : "Activar"}
      </button>
    </div>
  );
}
