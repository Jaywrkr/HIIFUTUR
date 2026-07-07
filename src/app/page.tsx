import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { MANTRAS } from "@/lib/mantras";
import { Reveal } from "@/components/Reveal";
import { ScrollTextLine } from "@/components/ScrollTextLine";

const FOR_YOU_IF = [
  "Ya intentaste 100 apps de habitos y las dejaste en la semana 2.",
  MANTRAS[15], // "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estas haciendo."
  "Estas cansado de sentirte mal por 'no tener disciplina'.",
  "Quieres resultados reales, no una racha de emojis.",
];

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

const FAQ = [
  {
    q: "Cuanto tiempo toma al dia?",
    a: "El que tu elijas para tu primer habito. Puede ser literalmente 2 minutos.",
  },
  {
    q: "Necesito comprar algo?",
    a: "No. Es gratis para empezar.",
  },
  {
    q: "Y si fallo un dia?",
    a: "No pasa nada. La unica regla real es no fallar dos dias seguidos.",
  },
  {
    q: "Esto es otro curso que voy a abandonar?",
    a: "Puede ser. Depende de si empiezas tan pequeno que sea imposible fallar. Por eso el sistema esta disenado asi, no al reves.",
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

      <Reveal>
        <p className="kicker">Sistema de ejecucion sostenible</p>
        <h1 className="text-3xl font-bold uppercase leading-tight mb-4">
          No es disciplina. No es fuerza de voluntad. Es un sistema que no pueda fallar.
        </h1>
        <p className="text-sm leading-relaxed text-neutral-300 mb-8 max-w-lg">
          Basado en el Principio de Pareto: el 20% de tus acciones genera el 80% de tu cambio.
          Sin gurus, sin 47 habitos a la vez, sin culpa cuando fallas un dia.
        </p>
        <div className="flex items-center gap-6 mb-24">
          <Link href="/register" className="btn-primary">EMPEZAR GRATIS</Link>
          <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
            Ya tengo cuenta
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <p className="kicker">Esto es para ti si...</p>
        <div className="mb-24">
          {FOR_YOU_IF.map((line) => (
            <div key={line} className="group flex items-start gap-4 border-b border-line py-4 last:border-b-0">
              <span className="text-accent mt-0.5 shrink-0">—</span>
              <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">{line}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="kicker">No lo escribio un equipo de marketing</p>
      </Reveal>

      <div className="border-l-2 border-l-accent pl-4 mb-24 flex flex-col gap-4">
        {[
          "Lo vivi yo.",
          "Pase de un promedio de 3 a un 9 en mi Wheel of Life, en 8 meses.",
          "No fue un giro de 180 grados de un dia para otro.",
          "Fue un sistema pequeño, sostenido, mes tras mes.",
          "Esto es ese sistema. No una version bonita de el.",
        ].map((line) => (
          <ScrollTextLine key={line}>
            <span className="text-lg font-bold leading-snug">{line}</span>
          </ScrollTextLine>
        ))}
        <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">— Jay</p>
      </div>

      <Reveal>
        <p className="kicker">Como funciona (y como no)</p>
        <p className="text-sm text-neutral-300 mb-6">
          No dietas. No despertar a las 5am. No 47 habitos a la vez.
        </p>
        <div className="mb-24">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="group flex gap-4 border-b border-line py-4 last:border-b-0 hover:border-l-2 hover:border-l-accent hover:pl-2 transition-all">
              <span className="text-xs text-accent tracking-widest mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-bold uppercase">{step.title}</p>
                <p className="muted mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <p className="kicker">Mantras de Jay</p>
        <div className="flex flex-col gap-6 mb-24">
          {[MANTRAS[9], MANTRAS[17], MANTRAS[12]].map((mantra) => (
            <p key={mantra} className="text-lg font-bold leading-snug">
              &ldquo;{mantra}&rdquo;
            </p>
          ))}
          <p className="text-xs uppercase tracking-widest text-neutral-500">— Jay</p>
        </div>
      </Reveal>

      <Reveal>
        <p className="kicker">Preguntas que te estas haciendo</p>
        <div className="mb-24">
          {FAQ.map((item) => (
            <div key={item.q} className="border-b border-line py-4 last:border-b-0">
              <p className="font-bold uppercase text-sm mb-1">{item.q}</p>
              <p className="muted">{item.a}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="border-t border-line pt-10 pb-16 text-center">
          <Link href="/register" className="btn-primary">EMPEZAR GRATIS</Link>
          <p className="muted mt-6">Un sistema, no una promesa.</p>
        </div>
      </Reveal>
    </main>
  );
}
