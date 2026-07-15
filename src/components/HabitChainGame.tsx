"use client";

import { useRef, useState } from "react";

// A stack of 4 habits — the point isn't which ones exactly, it's that you
// only ever push the first one. Everything downstream falls on its own.
const CHAIN = [
  { emoji: "☕", label: "Café" },
  { emoji: "🧘", label: "2 min meditar" },
  { emoji: "📓", label: "1 línea de gratitud" },
  { emoji: "💧", label: "Vaso de agua" },
];

/** Drag a single push onto the chain and watch every habit in it fall in
 * sequence — you don't drag each one separately, you push the first (the
 * one that's already automatic) and the rest goes on its own. */
export function HabitChainGame() {
  const [toppled, setToppled] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  function startDrag(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setDragPos({ x: e.clientX, y: e.clientY });
  }

  function moveDrag(e: React.PointerEvent) {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }

  function endDrag(e: React.PointerEvent) {
    if (!dragging) return;
    setDragging(false);
    setDragPos(null);
    const rect = rowRef.current?.getBoundingClientRect();
    const over =
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!over) return;
    setToppled(true);
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra el empujón al primer hábito de la cadena
      </p>

      <div
        ref={rowRef}
        className={`flex items-end gap-2 rounded-2xl border-2 border-dashed p-4 mb-4 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        {CHAIN.map((h, i) => (
          <div
            key={h.label}
            className={`flex-1 flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center transition-all duration-300 ${
              toppled ? "border-accent/50 bg-accent/10 -rotate-6" : "border-line"
            }`}
            style={{ transitionDelay: toppled ? `${i * 200}ms` : "0ms" }}
          >
            <span className="text-lg" aria-hidden="true">{h.emoji}</span>
            <span className="text-[10px] text-neutral-400 leading-tight">{h.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={() => {
            setDragging(false);
            setDragPos(null);
          }}
          style={{ touchAction: "none" }}
          disabled={toppled}
          className={`flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm text-accent cursor-grab active:cursor-grabbing select-none transition-opacity disabled:opacity-30 ${
            dragging ? "opacity-30" : ""
          }`}
        >
          <span aria-hidden="true">👆</span> Arrastra el empujón
        </button>
        {toppled ? (
          <button
            type="button"
            onClick={() => setToppled(false)}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
          >
            Reiniciar
          </button>
        ) : null}
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          👆
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed min-h-[1.5em]">
        {toppled
          ? "Un solo empujón — el que ya es automático — movió toda la cadena. No cargas cada hábito por separado."
          : "Empuja el primero. Mira qué pasa con el resto."}
      </p>
    </div>
  );
}
