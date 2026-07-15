"use client";

import { useRef, useState } from "react";

type CandidateId = "sleep" | "water" | "phone" | "series";

// Not every habit weighs the same — a few candidates, and a fixed cascade
// count for each, so dragging different ones into the spotlight always
// teaches the same real lesson: the anchor isn't the flashiest one, it's
// the one that drags the most areas without extra effort.
const CANDIDATES: { id: CandidateId; emoji: string; label: string; cascade: number }[] = [
  { id: "sleep", emoji: "😴", label: "Dormir a una hora fija", cascade: 4 },
  { id: "phone", emoji: "📵", label: "Revisar el celular menos", cascade: 2 },
  { id: "water", emoji: "💧", label: "Tomar agua al despertar", cascade: 1 },
  { id: "series", emoji: "📺", label: "Ver una serie nueva cada noche", cascade: 0 },
];

const AREAS = ["Energía", "Entrenamiento", "Ánimo", "Relaciones"];

function captionFor(cascade: number): string {
  if (cascade === 0) return "Este no arrastra nada — solo se siente productivo.";
  if (cascade === 1) return "Ayuda un poco, pero no jala al resto por sí solo.";
  if (cascade <= 2) return "Mueve un par de áreas — va por buen camino, pero no es tu ancla todavía.";
  return "Este es tu ancla: un solo hábito, cuatro áreas moviéndose sin esfuerzo extra.";
}

/** Drag a habit candidate into the spotlight and watch how many areas light
 * up in cascade — not all habits weigh the same, and the anchor is the one
 * that drags the most without you working on each area separately. */
export function AnchorCascadeGame() {
  const [selected, setSelected] = useState<CandidateId | null>(null);
  const [dragging, setDragging] = useState<CandidateId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const selectedCandidate = CANDIDATES.find((c) => c.id === selected) ?? null;
  const cascade = selectedCandidate?.cascade ?? 0;

  function startDrag(e: React.PointerEvent<HTMLButtonElement>, id: CandidateId) {
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
    const overSpotlight =
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    setDragging(null);
    setDragPos(null);
    if (!overSpotlight) return;
    setSelected(id);
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra un candidato al centro
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {CANDIDATES.map((c) => (
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
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs cursor-grab active:cursor-grabbing select-none transition-opacity ${
              selected === c.id ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-neutral-300"
            } ${dragging === c.id ? "opacity-30" : ""}`}
          >
            <span className="text-base" aria-hidden="true">{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      <div
        ref={spotlightRef}
        className={`rounded-2xl border-2 border-dashed p-4 text-center mb-4 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        {selectedCandidate ? (
          <p className="text-sm">
            <span className="text-lg mr-1" aria-hidden="true">{selectedCandidate.emoji}</span>
            <span className="font-bold">{selectedCandidate.label}</span>
          </p>
        ) : (
          <p className="text-xs text-neutral-500">Suelta aquí tu candidato a ancla</p>
        )}
      </div>

      <div className="flex gap-1.5 mb-4">
        {AREAS.map((area, i) => (
          <div
            key={area}
            className={`flex-1 rounded-lg border px-2 py-3 text-center text-[10px] uppercase tracking-widest transition-all duration-300 ${
              i < cascade ? "border-accent/50 bg-accent/10 text-accent" : "border-line text-neutral-600"
            }`}
            style={{ transitionDelay: i < cascade ? `${i * 150}ms` : "0ms" }}
          >
            {area}
          </div>
        ))}
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          {CANDIDATES.find((c) => c.id === dragging)?.emoji}
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed min-h-[1.5em]">
        {selectedCandidate ? captionFor(cascade) : "Prueba cada candidato y compara cuántas áreas mueve."}
      </p>
    </div>
  );
}
