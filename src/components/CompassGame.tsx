"use client";

import { useRef, useState } from "react";

type AreaId = "salud" | "relaciones" | "finanzas" | "proposito";

// A compass doesn't grade you — it points. Each area has a fixed delta vs.
// last month (some up, some down, one flat) so dragging the needle around
// always lands somewhere real, not a pass/fail score.
const AREAS: { id: AreaId; emoji: string; label: string; delta: number; note: string }[] = [
  {
    id: "salud",
    emoji: "💪",
    label: "Salud",
    delta: 2,
    note: "Subió. Tu hábito ancla está arrastrando esta área, tal como debería.",
  },
  {
    id: "relaciones",
    emoji: "❤️",
    label: "Relaciones",
    delta: -1,
    note: "Bajó un poco. Está compitiendo por tu tiempo con algo más — vale la pena mirarlo.",
  },
  {
    id: "finanzas",
    emoji: "💰",
    label: "Finanzas",
    delta: 0,
    note: "Igual que el mes pasado. Ni mejoró ni empeoró — dato, no drama.",
  },
  {
    id: "proposito",
    emoji: "🎯",
    label: "Propósito",
    delta: 1,
    note: "Subió un poco. Pequeño, pero es movimiento real, no una sensación.",
  },
];

function arrowFor(delta: number): string {
  if (delta > 0) return "↑";
  if (delta < 0) return "↓";
  return "→";
}

function colorFor(delta: number): string {
  if (delta > 0) return "text-accent";
  if (delta < 0) return "text-red-400";
  return "text-neutral-400";
}

/** Drag the compass needle to any area and see how it actually moved since
 * last month — not a grade, a direction. That's the whole point: the Wheel
 * of Life tells you where you're heading, not how "good" you are. */
export function CompassGame() {
  const [selected, setSelected] = useState<AreaId | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const areaRefs = useRef<(HTMLDivElement | null)[]>([]);

  const area = AREAS.find((a) => a.id === selected) ?? null;

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
    const idx = areaRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (idx === -1) return;
    setSelected(AREAS[idx].id);
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra la brújula a un área
      </p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {AREAS.map((a, i) => (
          <div
            key={a.id}
            ref={(el) => {
              areaRefs.current[i] = el;
            }}
            className={`rounded-xl border px-3 py-3 text-center transition-colors ${
              selected === a.id ? "border-accent/50 bg-accent/10" : "border-line"
            }`}
          >
            <span className="text-lg" aria-hidden="true">{a.emoji}</span>
            <p className="text-xs text-neutral-300 mt-1">{a.label}</p>
            {selected === a.id ? (
              <p className={`text-sm font-bold mt-1 ${colorFor(a.delta)}`}>
                {arrowFor(a.delta)} {a.delta > 0 ? `+${a.delta}` : a.delta}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-4">
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
          className={`flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 py-3 text-lg text-accent cursor-grab active:cursor-grabbing select-none transition-opacity ${
            dragging ? "opacity-30" : ""
          }`}
        >
          🧭
        </button>
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          🧭
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed min-h-[1.5em]">
        {area ? area.note : "Prueba cada área — la brújula no califica, solo señala hacia dónde te mueves."}
      </p>
    </div>
  );
}
