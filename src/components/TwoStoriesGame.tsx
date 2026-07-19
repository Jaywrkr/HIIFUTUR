"use client";

import { useRef, useState } from "react";

type ThoughtId = "wasted" | "unfair" | "twoweeks" | "minimal";
type Story = "victima" | "regreso";

// Real post-relapse thoughts, half victim-framed and half recovery-framed —
// dragging either kind into the spotlight shows exactly where it leads. Not
// the fall itself, but the story you tell yourself right after it.
const THOUGHTS: { id: ThoughtId; label: string; story: Story }[] = [
  { id: "wasted", label: "Total, ya la regué, para qué sigo", story: "victima" },
  { id: "unfair", label: "La vida no me ha dado las mismas oportunidades", story: "victima" },
  { id: "twoweeks", label: "Perdí 2 semanas, no perdí el sistema", story: "regreso" },
  { id: "minimal", label: "Hoy retomo la versión mínima, sin drama", story: "regreso" },
];

const OUTCOME: Record<Story, { icon: string; status: string; caption: string }> = {
  victima: {
    icon: "🔌",
    status: "Sistema apagado",
    caption: "Esta historia te saca del sistema por semanas — no es la caída, es la historia.",
  },
  regreso: {
    icon: "🟢",
    status: "Sistema sigue prendido",
    caption: "Esta historia te devuelve al sistema hoy mismo, no la próxima semana.",
  },
};

/** Drag a post-relapse thought into the spotlight and see where it leads —
 * not whether you failed (you did), but which story about that failure you
 * pick up next. */
export function TwoStoriesGame() {
  const [selected, setSelected] = useState<ThoughtId | null>(null);
  const [dragging, setDragging] = useState<ThoughtId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const thought = THOUGHTS.find((t) => t.id === selected) ?? null;
  const outcome = thought ? OUTCOME[thought.story] : null;

  function startDrag(e: React.PointerEvent<HTMLButtonElement>, id: ThoughtId) {
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
    const rect = spotlightRef.current?.getBoundingClientRect();
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
        Fallaste ayer. Arrastra el pensamiento que tuviste
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {THOUGHTS.map((t) => (
          <button
            key={t.id}
            type="button"
            onPointerDown={(e) => startDrag(e, t.id)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={() => {
              setDragging(null);
              setDragPos(null);
            }}
            style={{ touchAction: "none" }}
            className={`rounded-md border px-3 py-2 text-xs text-left cursor-grab active:cursor-grabbing select-none transition-opacity ${
              selected === t.id ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-neutral-300"
            } ${dragging === t.id ? "opacity-30" : ""}`}
          >
            &ldquo;{t.label}&rdquo;
          </button>
        ))}
      </div>

      <div
        ref={spotlightRef}
        className={`rounded-lg border-2 border-dashed p-4 text-center mb-4 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        {outcome ? (
          <p className="text-sm">
            <span className="text-lg mr-1" aria-hidden="true">{outcome.icon}</span>
            <span className="font-bold">{outcome.status}</span>
          </p>
        ) : (
          <p className="text-xs text-neutral-500">Suelta aquí el pensamiento</p>
        )}
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          💭
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed min-h-[1.5em]">
        {outcome ? outcome.caption : "Prueba los dos tipos de pensamiento y compara adónde llevan."}
      </p>
    </div>
  );
}
