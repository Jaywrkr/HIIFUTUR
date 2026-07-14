"use client";

import { useRef, useState } from "react";

const TIME_STEPS = [
  { label: "6am", lit: 5 },
  { label: "10am", lit: 4 },
  { label: "1pm", lit: 3 },
  { label: "5pm", lit: 2 },
  { label: "9pm", lit: 1 },
];

type ChipId = "big" | "tiny";

const CHIPS: { id: ChipId; emoji: string; label: string; minLit: number }[] = [
  { id: "big", emoji: "🏋️", label: "1 hora de ejercicio", minLit: 3 },
  { id: "tiny", emoji: "🦶", label: "5 sentadillas", minLit: 0 },
];

/** Drag a habit chip onto the battery at whatever time you picked. The big
 * one only "survives" while the battery is still high; the tiny one always
 * does — the module's whole lesson, felt instead of just read. */
export function WillpowerBatteryGame() {
  const [timeIdx, setTimeIdx] = useState(0);
  const [dragging, setDragging] = useState<ChipId | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [result, setResult] = useState<{ chip: ChipId; success: boolean } | null>(null);
  const [tried, setTried] = useState<Set<ChipId>>(new Set());
  const batteryRef = useRef<HTMLDivElement>(null);

  const lit = TIME_STEPS[timeIdx].lit;

  function startDrag(e: React.PointerEvent<HTMLButtonElement>, chip: ChipId) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(chip);
    setDragPos({ x: e.clientX, y: e.clientY });
    setResult(null);
  }

  function moveDrag(e: React.PointerEvent) {
    if (!dragging) return;
    setDragPos({ x: e.clientX, y: e.clientY });
  }

  function endDrag(e: React.PointerEvent) {
    if (!dragging) return;
    const chip = dragging;
    const batteryRect = batteryRef.current?.getBoundingClientRect();
    const overBattery =
      batteryRect &&
      e.clientX >= batteryRect.left &&
      e.clientX <= batteryRect.right &&
      e.clientY >= batteryRect.top &&
      e.clientY <= batteryRect.bottom;
    setDragging(null);
    setDragPos(null);
    if (!overBattery) return;
    const chipDef = CHIPS.find((c) => c.id === chip)!;
    const success = lit >= chipDef.minLit;
    setResult({ chip, success });
    setTried((prev) => new Set(prev).add(chip));
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
        Toca la hora del día
      </p>
      <div className="flex gap-1.5 mb-4">
        {TIME_STEPS.map((t, i) => (
          <button
            key={t.label}
            type="button"
            onClick={() => {
              setTimeIdx(i);
              setResult(null);
            }}
            className={`flex-1 text-[10px] uppercase tracking-widest py-1.5 rounded-full border transition-colors ${
              i === timeIdx
                ? "border-accent text-accent bg-accent/10"
                : "border-line text-neutral-500 hover:border-accent/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div
        ref={batteryRef}
        className={`flex items-center gap-1.5 rounded-lg border-2 p-1.5 mb-5 transition-colors ${
          dragging ? "border-accent" : "border-neutral-600"
        }`}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-8 flex-1 rounded transition-colors ${
              i < lit ? (i < 2 ? "bg-accent" : "bg-accent/50") : "bg-neutral-800"
            }`}
          />
        ))}
      </div>

      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2">
        Arrastra un hábito a la batería
      </p>
      <div className="flex gap-3">
        {CHIPS.map((c) => (
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
            className={`flex-1 flex flex-col items-center gap-1 rounded-xl border border-line px-3 py-3 text-center cursor-grab active:cursor-grabbing select-none transition-opacity ${
              dragging === c.id ? "opacity-30" : ""
            }`}
          >
            <span className="text-2xl" aria-hidden="true">{c.emoji}</span>
            <span className="text-xs text-neutral-300">{c.label}</span>
            {tried.has(c.id) ? (
              <span className="text-[10px] text-neutral-500">ya lo probaste</span>
            ) : null}
          </button>
        ))}
      </div>

      {dragging && dragPos ? (
        <div
          className="fixed z-50 pointer-events-none text-3xl"
          style={{ left: dragPos.x - 18, top: dragPos.y - 18 }}
          aria-hidden="true"
        >
          {CHIPS.find((c) => c.id === dragging)?.emoji}
        </div>
      ) : null}

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-sm font-semibold min-h-[1.5em] ${
          result ? (result.success ? "text-accent" : "text-red-400 shake-error") : "text-transparent"
        }`}
      >
        {result
          ? result.success
            ? "✓ Esto sí sobrevive, sin importar la hora."
            : "✗ Con la batería así, esto no pasó."
          : "."}
      </p>
    </div>
  );
}
