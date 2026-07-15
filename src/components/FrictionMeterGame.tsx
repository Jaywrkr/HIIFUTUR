"use client";

import { useRef, useState } from "react";

type ChangeId = "clothes" | "phone" | "buy" | "nothing";

// Friction level left after each change (5 = worst, 1 = best) — the point
// isn't "spend money", it's "reduce the exact friction that's stopping
// you". Buying gear barely moves the needle; a free, specific fix does.
const CHANGES: { id: ChangeId; emoji: string; label: string; friction: number; note: string }[] = [
  {
    id: "clothes",
    emoji: "👕",
    label: "Dejar la ropa lista la noche anterior",
    friction: 1,
    note: "Gratis, y quita la excusa antes de que exista.",
  },
  {
    id: "phone",
    emoji: "📵",
    label: "Cargar el celular en otro cuarto",
    friction: 2,
    note: "Gratis — rompe el hábito de revisarlo antes de levantarte.",
  },
  {
    id: "buy",
    emoji: "🛍️",
    label: "Comprar tenis nuevos",
    friction: 4,
    note: "Cuesta, y casi no reduce la fricción real de hoy.",
  },
  {
    id: "nothing",
    emoji: "🤷",
    label: "No cambiar nada",
    friction: 5,
    note: "La fuerza de voluntad va a perder, tarde o temprano.",
  },
];

const MAX_FRICTION = 5;

/** Drag a candidate environment change into the meter and watch friction
 * drop by however much that specific change actually helps — cheap and
 * specific beats expensive and vague, every time you try it. */
export function FrictionMeterGame() {
  const [selected, setSelected] = useState<ChangeId | null>(null);
  const [dragging, setDragging] = useState<ChangeId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const meterRef = useRef<HTMLDivElement>(null);

  const change = CHANGES.find((c) => c.id === selected) ?? null;
  const friction = change?.friction ?? MAX_FRICTION;

  function startDrag(e: React.PointerEvent<HTMLButtonElement>, id: ChangeId) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(id);
    setDragPos({ x: e.clientX, y: e.clientY });
  }

  function moveDrag(e: React.PointerEvent) {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }

  function endDrag(e: React.PointerEvent) {
    if (!dragging) return;
    const id = dragging;
    const rect = meterRef.current?.getBoundingClientRect();
    const over =
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    setDragging(null);
    setDragPos(null);
    if (!over) return;
    setSelected(id);
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra un cambio al medidor de fricción
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {CHANGES.map((c) => (
          <button
            key={c.id}
            type="button"
            onPointerDown={(e) => startDrag(e, c.id)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={() => {
              setDragging(null);
              setDragPos(null);
            }}
            style={{ touchAction: "none" }}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs text-left cursor-grab active:cursor-grabbing select-none transition-opacity ${
              selected === c.id ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-neutral-300"
            } ${dragging === c.id ? "opacity-30" : ""}`}
          >
            <span className="text-base shrink-0" aria-hidden="true">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div
        ref={meterRef}
        className={`rounded-2xl border-2 border-dashed p-4 mb-4 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
          <span>Fricción</span>
          <span>{friction >= 4 ? "Alta" : friction >= 2 ? "Media" : "Baja"}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_FRICTION }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                i < friction ? "bg-red-500/70" : "bg-neutral-800"
              }`}
            />
          ))}
        </div>
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          {CHANGES.find((c) => c.id === dragging)?.emoji}
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed min-h-[1.5em]">
        {change ? change.note : "Prueba cada cambio y compara cuánta fricción quita de verdad."}
      </p>
    </div>
  );
}
