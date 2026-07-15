"use client";

import { useRef, useState } from "react";

const TOTAL_VOTES = 10;

function phraseFor(count: number): string {
  if (count === 0) return "Arrastra un voto para empezar.";
  if (count <= 2) return "Todavía es solo una intención.";
  if (count <= 5) return "Empieza a ser un patrón.";
  if (count < TOTAL_VOTES) return "Ya es difícil negar que eres alguien que hace esto.";
  return "Esto ya es quién eres.";
}

/** Drag a "vote" into the row, one at a time — no single vote changes
 * anything by itself, but watch the phrase shift as they add up. That's
 * the module's whole point: identity isn't decided, it's accumulated. */
export function IdentityVotesGame() {
  const [votes, setVotes] = useState(0);
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
    setVotes((v) => Math.min(TOTAL_VOTES, v + 1));
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra un voto a la fila — toca una barra llena para quitarlo
      </p>

      <div
        ref={rowRef}
        className={`flex items-end gap-1.5 h-16 mb-4 rounded-lg border-2 border-dashed p-2 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        {Array.from({ length: TOTAL_VOTES }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (i < votes) setVotes(i);
            }}
            disabled={i >= votes}
            className={`flex-1 rounded-sm transition-all duration-300 ${
              i < votes ? "bg-accent" : "bg-neutral-800"
            }`}
            style={{ height: i < votes ? "100%" : "30%" }}
            aria-label={`Voto ${i + 1}${i < votes ? ", puesto — toca para quitarlo" : ", vacío"}`}
          />
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
          disabled={votes >= TOTAL_VOTES}
          className={`flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm text-accent cursor-grab active:cursor-grabbing select-none transition-opacity disabled:opacity-30 ${
            dragging ? "opacity-30" : ""
          }`}
        >
          <span aria-hidden="true">✓</span> Arrastra un voto
        </button>
        <span className="text-xs uppercase tracking-widest text-neutral-500">
          {votes}/{TOTAL_VOTES} votos
        </span>
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl text-accent"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          ✓
        </div>
      ) : null}

      <p role="status" aria-live="polite" className="text-sm text-neutral-300 leading-relaxed min-h-[1.5em]">
        {phraseFor(votes)}
      </p>
    </div>
  );
}
