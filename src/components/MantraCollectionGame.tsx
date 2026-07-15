"use client";

import { useRef, useState } from "react";

export type MantraCard = { id: string; order: number; mantra: string };

/** Drag the mantra that hit hardest into your pocket — the closing module
 * isn't teaching a new idea, it's asking you to pick one you already lived
 * through, right before you write your own. Takes the mantra list as a
 * prop (not imported from modules-content) so the rest of the course's
 * theory/exercise text never ships into the client bundle. */
export function MantraCollectionGame({ mantras }: { mantras: MantraCard[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const pocketRef = useRef<HTMLDivElement>(null);

  const selected = mantras.find((m) => m.id === selectedId) ?? null;

  function startDrag(e: React.PointerEvent<HTMLButtonElement>, id: string) {
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
    const rect = pocketRef.current?.getBoundingClientRect();
    const over =
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    setDragging(null);
    setDragPos(null);
    if (!over) return;
    setSelectedId(id);
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra a tu bolsillo la que más te marcó
      </p>

      <div className="flex flex-col gap-1.5 mb-4 max-h-52 overflow-y-auto pr-1">
        {mantras.map((m) => (
          <button
            key={m.id}
            type="button"
            onPointerDown={(e) => startDrag(e, m.id)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={() => {
              setDragging(null);
              setDragPos(null);
            }}
            style={{ touchAction: "none" }}
            className={`flex gap-3 items-start rounded-lg border px-3 py-2 text-left cursor-grab active:cursor-grabbing select-none transition-opacity ${
              selectedId === m.id ? "border-accent/50 bg-accent/10" : "border-line"
            } ${dragging === m.id ? "opacity-30" : ""}`}
          >
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 shrink-0 mt-0.5 w-6">
              {m.order}
            </span>
            <span className="text-xs text-neutral-400 italic leading-snug">
              &ldquo;{m.mantra.length > 70 ? m.mantra.slice(0, 68) + "…" : m.mantra}&rdquo;
            </span>
          </button>
        ))}
      </div>

      <div
        ref={pocketRef}
        className={`rounded-2xl border-2 border-dashed p-4 text-center mb-2 transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-line"
        }`}
      >
        {selected ? (
          <div>
            <p className="text-sm font-bold text-accent leading-snug">&ldquo;{selected.mantra}&rdquo;</p>
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mt-2">
              Módulo {selected.order} — guardada. Ya es tuya también.
            </p>
          </div>
        ) : (
          <p className="text-xs text-neutral-500">👝 Tu bolsillo</p>
        )}
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-2xl"
          style={{ left: dragPos.x - 14, top: dragPos.y - 14 }}
          aria-hidden="true"
        >
          📌
        </div>
      ) : null}
    </div>
  );
}
