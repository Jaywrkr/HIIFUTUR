import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { MANTRAS } from "@/lib/mantras";

const HOW_IT_WORKS = [
  {
    title: "Aprende",
    description: "11 modulos interactivos basados en el Principio de Pareto y en habitos atomicos.",
  },
  {
    title: "Encuentra tu habito ancla",
    description: "El unico habito que, si lo sostienes, jala a todos los demas sin esfuerzo extra.",
  },
  {
    title: "Sostenlo",
    description: "Habit tracker progresivo: maximo 5 habitos, uno a la vez, sin castigo por fallar.",
  },
  {
    title: "Mide tu vida",
    description: "Wheel of Life cada 30 dias. Sin drama, solo la realidad y hacia donde te mueves.",
  },
];

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-16">
        <span className="text-sm font-bold tracking-[0.3em] text-white">EJECUTA</span>
        <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
          Iniciar sesion
        </Link>
      </div>

      <p className="kicker">Sistema de ejecucion sostenible</p>
      <h1 className="text-3xl font-bold uppercase leading-tight mb-4">
        No necesitas motivacion. Necesitas un sistema que no pueda fallar.
      </h1>
      <p className="text-sm leading-relaxed text-neutral-300 mb-8 max-w-lg">
        Basado en el Principio de Pareto: el 20% de tus acciones genera el 80% de tu cambio.
        Un curso interactivo, un habit tracker progresivo y una medicion real de tu vida —
        no otro curso de motivacion.
      </p>
      <div className="flex items-center gap-6 mb-20">
        <Link href="/register" className="btn-primary">EMPEZAR GRATIS</Link>
        <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
          Ya tengo cuenta
        </Link>
      </div>

      <blockquote className="border-l-2 border-l-accent pl-4 mb-20">
        <p className="text-sm leading-relaxed text-neutral-300">
          Este curso nace de mi propia transformacion: pase de un promedio de 3 a un 9 en mi
          Wheel of Life, en 8 meses. No fue un giro de 180 grados de un dia para otro — fue un
          sistema pequeño, sostenido, mes tras mes. Esto es ese sistema.
        </p>
        <p className="text-xs uppercase tracking-widest text-neutral-500 mt-3">— Jay</p>
      </blockquote>

      <p className="kicker">Como funciona</p>
      <div className="mb-20">
        {HOW_IT_WORKS.map((step, i) => (
          <div key={step.title} className="list-row">
            <div className="flex gap-4">
              <span className="text-xs text-accent tracking-widest mt-1">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-bold uppercase">{step.title}</p>
                <p className="muted mt-1">{step.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="kicker">Mantras de Jay</p>
      <div className="flex flex-col gap-6 mb-20">
        {[MANTRAS[9], MANTRAS[17], MANTRAS[12]].map((mantra) => (
          <p key={mantra} className="text-lg font-bold leading-snug">
            &ldquo;{mantra}&rdquo;
          </p>
        ))}
        <p className="text-xs uppercase tracking-widest text-neutral-500">— Jay</p>
      </div>

      <div className="border-t border-line pt-10 pb-16 text-center">
        <Link href="/register" className="btn-primary">EMPEZAR GRATIS</Link>
        <p className="muted mt-6">Un sistema, no una promesa.</p>
      </div>
    </main>
  );
}
