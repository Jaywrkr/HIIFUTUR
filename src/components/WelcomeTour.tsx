"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    emoji: "🎉",
    title: "Tu sistema está listo",
    body: "Felicidades por llegar hasta aquí. La mayoría no pasa del 'algún día'. Tú ya tienes tu línea base medida y un camino enfrente. Esto es lo que sigue.",
  },
  {
    emoji: "🧭",
    title: "La metodología, en 3 partes",
    body: "Curso + Hábitos + Wheel of Life. O dicho de otra forma: Aprendizaje + Acción + Control. Aprendes algo pequeño, lo conviertes en hábito, y cada 30 días mides si de verdad se movió algo.",
  },
  {
    emoji: "📚",
    title: "Empieza por el curso",
    body: "El Módulo 1 ya está abierto. Al terminarlo vas a crear tu primer hábito — el ancla. No al revés: primero entiendes por qué fallabas antes, después ejecutas.",
  },
  {
    emoji: "🔥",
    title: "El curso avanza con tu racha",
    body: "Cada 3 días reales de hábito cumplido desbloquean el siguiente módulo. Son 30 días en total. Puedes fallar hasta 2 veces; a la tercera, el ciclo se reinicia — pero no pierdes todo: conservas la mitad de tus puntos y tus respuestas siguen escritas. El contenido no se lee — se gana.",
  },
  {
    emoji: "🎯",
    title: "Cada 30 días: tu rueda",
    body: "Al cumplir el ciclo vuelves a medir tu Wheel of Life, contra tu línea base de hoy. Ahí ves — con números, no con sensaciones — qué movió tu hábito.",
  },
];

export function WelcomeTour() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  function close() {
    setVisible(false);
    // Strip ?bienvenida=1 so a reload doesn't reopen the tour.
    router.replace("/modules", { scroll: false });
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-8 text-center">
        <p className="text-4xl mb-4">{current.emoji}</p>
        <h2 className="text-2xl font-extrabold tracking-tight mb-3">{current.title}</h2>
        <p className="text-sm text-neutral-300 leading-relaxed mb-8">{current.body}</p>

        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? "w-6 bg-accent" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => (isLast ? close() : setStep((s) => s + 1))}
            className="btn-primary w-full"
          >
            {isLast ? "EMPEZAR CON EL MÓDULO 1" : "SIGUIENTE"}
          </button>
          {!isLast ? (
            <button
              type="button"
              onClick={close}
              className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Saltar
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
