"use client";

import { useState } from "react";
import { ZenGarden } from "@/components/ZenGarden";

export function ZenGardenLauncher({ habitCount }: { habitCount: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full px-6 py-5 flex items-center gap-4 text-left hover:bg-accent/5 transition-colors group"
      >
        <span className="w-10 h-10 rounded-full border border-line flex items-center justify-center shrink-0">
          <span className="w-2.5 h-2.5 rounded-full border border-accent" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Un momento para ti</p>
          <p className="font-normal text-sm">Jardín zen</p>
        </div>
        <span className="text-neutral-400 group-hover:text-accent transition-colors">→</span>
      </button>
      {open ? <ZenGarden habitCount={habitCount} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
