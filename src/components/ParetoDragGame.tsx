"use client";

import { useState } from "react";

const ACTIONS = [
  "Dormir 7-8 horas",
  "Hacer tu hábito ancla",
  "Entrenar o moverte 20 min",
  "Comer sin saltarte comidas",
  "Planear el día en 5 min",
  "Responder lo importante",
  "Leer 10 páginas",
  "Ordenar tu espacio",
  "Revisar redes sociales",
  "Scroll sin rumbo",
];

/** % of "result" captured by protecting the first n actions (n = 0..10) —
 * shaped like a real Pareto curve: steep at first, almost flat after. */
const CUMULATIVE = [0, 55, 80, 88, 92, 95, 97, 98, 99, 99.5, 100];

/** Drag the slider to pick how many of the (pre-ranked) actions you protect
 * and watch how much of the result you actually capture — the module's
 * 80/20 idea as a number that moves, not just a static split bar. */
export function ParetoDragGame() {
  const [n, setN] = useState(0);
  const pct = CUMULATIVE[n];

  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">
        Arrastra para elegir cuántas acciones proteges
      </p>

      <div className="flex flex-col gap-1.5 mb-4">
        {ACTIONS.map((a, i) => (
          <div
            key={a}
            className={`text-xs rounded-lg px-3 py-2 border transition-colors ${
              i < n
                ? "border-accent/50 bg-accent/10 text-accent font-semibold"
                : "border-line text-neutral-500"
            }`}
          >
            {a}
          </div>
        ))}
      </div>

      <input
        type="range"
        min={0}
        max={10}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
        className="w-full accent-accent mb-3"
        aria-label="Cuántas acciones proteges, de 10"
      />

      <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-400 mb-1">
        <span>{n} de 10 acciones ({n * 10}%)</span>
        <span className="text-accent font-bold">{pct}% del resultado</span>
      </div>
      <div className="h-3 rounded-full bg-ink border border-line overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p role="status" aria-live="polite" className="text-sm mt-4 text-neutral-300 leading-relaxed">
        {n === 0
          ? "Mueve el control para empezar a proteger tus acciones más importantes."
          : n <= 2
            ? `Con solo ${n} de 10 (${n * 10}%) ya capturas ${pct}% del resultado. Ese es tu 20%.`
            : "Fíjate cuánto más agregas después del 20% — casi no sube. Eso es ruido disfrazado de productividad."}
      </p>
    </div>
  );
}
