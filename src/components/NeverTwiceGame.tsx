"use client";

import { useRef, useState } from "react";

const DAYS = 7;

/** Arrastra la ficha de "fallo" a cualquier día de la semana (o toca uno ya
 * marcado para quitarlo) y mira en vivo si la regla del módulo se cumple:
 * un fallo suelto no rompe nada, pero dos seguidos sí. La única forma de
 * "perder" el juego es exactamente la única regla real que enseña el
 * módulo — no una metáfora aparte de ella. */
export function NeverTwiceGame() {
  const [failed, setFailed] = useState<boolean[]>(() => new Array(DAYS).fill(false));
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);

  let brokenPairStart = -1;
  for (let i = 0; i < DAYS - 1; i++) {
    if (failed[i] && failed[i + 1]) {
      brokenPairStart = i;
      break;
    }
  }
  const broken = brokenPairStart !== -1;
  const anyFailed = failed.some(Boolean);

  function toggleCell(i: number) {
    setFailed((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

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
    const idx = cellRefs.current.findIndex((el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (idx === -1) return;
    setFailed((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra un fallo a un día — toca uno marcado para quitarlo
      </p>

      <div className="flex gap-1.5 mb-4">
        {Array.from({ length: DAYS }).map((_, i) => {
          const isBrokenPair = broken && (i === brokenPairStart || i === brokenPairStart + 1);
          return (
            <button
              key={i}
              type="button"
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              onClick={() => toggleCell(i)}
              aria-pressed={failed[i]}
              aria-label={`Día ${i + 1}: ${failed[i] ? "fallo" : "hecho"}`}
              className={`flex-1 h-12 rounded-lg border flex items-center justify-center text-lg transition-colors ${
                !failed[i]
                  ? "border-accent/40 bg-accent/10 text-accent"
                  : isBrokenPair
                    ? "border-red-500 bg-red-500/20 text-red-400 shake-error"
                    : "border-neutral-600 bg-neutral-800 text-neutral-400"
              }`}
            >
              {failed[i] ? "✗" : "✓"}
            </button>
          );
        })}
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
          className={`flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 cursor-grab active:cursor-grabbing select-none transition-opacity ${
            dragging ? "opacity-30" : ""
          }`}
        >
          <span aria-hidden="true">✗</span> Arrastra un fallo
        </button>
        <button
          type="button"
          onClick={() => setFailed(new Array(DAYS).fill(false))}
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
        >
          Reiniciar
        </button>
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl text-red-400"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          ✗
        </div>
      ) : null}

      <p
        role="status"
        aria-live="polite"
        className={`text-sm font-semibold min-h-[1.5em] ${broken ? "text-red-400" : "text-accent"}`}
      >
        {broken
          ? "✗ Dos seguidos: así es como se rompe."
          : anyFailed
            ? "✓ Un fallo suelto no rompe nada — el sistema sigue vivo."
            : "Arrastra un par de fallos a la semana y mira qué la rompe."}
      </p>
    </div>
  );
}
