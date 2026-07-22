"use client";

import { useEffect, useState } from "react";

const KEY = "ejecuta_grain";

/** Same pattern as DensityToggle: a personal display preference in
 * localStorage, applied as a data-grain attribute on <html>, read before
 * first paint by the blocking script in layout.tsx so there's no flash. */
export function GrainToggle() {
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    setOn(document.documentElement.getAttribute("data-grain") === "on");
  }, []);

  function apply(next: boolean) {
    setOn(next);
    if (next) {
      document.documentElement.setAttribute("data-grain", "on");
      localStorage.setItem(KEY, "on");
    } else {
      document.documentElement.removeAttribute("data-grain");
      localStorage.setItem(KEY, "off");
    }
  }

  if (on === null) return null;

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-400">
        {on ? "Una textura fina sobre toda la pantalla." : "Fondo liso."}
      </p>
      <button type="button" onClick={() => apply(!on)} className="btn-secondary text-xs py-2 px-4">
        {on ? "Desactivar" : "Activar"}
      </button>
    </div>
  );
}
