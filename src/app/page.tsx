import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { MANTRAS } from "@/lib/mantras";
import { Reveal } from "@/components/Reveal";
import { ScrollTextLine } from "@/components/ScrollTextLine";
import { WordReveal, type RevealWord } from "@/components/WordReveal";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { WebAppMockup } from "@/components/WebAppMockup";
import { PhoneMantra } from "@/components/PhoneMantra";

const PHILOSOPHY = [
  {
    title: "Empieza tan pequeño que no puedas fallar",
    description: "Un habito a la vez. Si necesitas fuerza de voluntad para hacerlo, esta mal diseñado.",
  },
  {
    title: "La consistencia le gana a la intensidad",
    description: "Todos los dias le gana a algunos dias increibles. El sistema premia mostrarte, no rendir al maximo.",
  },
  {
    title: "Si no lo disfrutas, no dura",
    description: "Elige el habito que se sienta bien sostener, no el que se ve mejor en redes.",
  },
];

const WEB_FEATURES = [
  {
    icon: "⚡",
    title: "Cero configuracion",
    description: "Abre el link y listo. Nada que instalar, nada que actualizar.",
  },
  {
    icon: "🔁",
    title: "Misma cuenta, en cualquier lugar",
    description: "Celular, laptop, tablet. Tu racha te sigue a ti, no al dispositivo.",
  },
  {
    icon: "🖥️",
    title: "Funciona en cualquier pantalla",
    description: "Marca tu habito desde el celular en la mañana o desde la laptop en la oficina.",
  },
];

const WHY_WE_BUILT_IT: RevealWord[] = [
  { text: "La" }, { text: "mayoria" }, { text: "de" }, { text: "las" }, { text: "apps" },
  { text: "de" }, { text: "habitos" }, { text: "estan" }, { text: "hechas" }, { text: "para" },
  { text: "que" }, { text: "te" }, { text: "sientas" }, { text: "culpable.", strike: true },
  { text: "Nosotros" }, { text: "hicimos" }, { text: "un" }, { text: "sistema" }, { text: "para" },
  { text: "que" }, { text: "sigas," }, { text: "aunque" }, { text: "falles." },
];

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

function FloatingStat({
  icon,
  label,
  value,
  className,
}: {
  icon: string;
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div
      className={`absolute bg-surface border border-line rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-3 ${className}`}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <div>
        <p className="font-extrabold leading-tight">{value}</p>
        <p className="text-xs text-neutral-500 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.3em] text-white">EJECUTA</span>
        <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
          Iniciar sesion
        </Link>
      </div>

      {/* Hero: two columns, full width, floating stat mockups on the right
          (illustrative example data, not a claim about any real user). */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-center py-10 md:py-20">
          <Reveal>
            <p className="kicker">Sistema de ejecucion sostenible</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
              No es disciplina. No es fuerza de voluntad.{" "}
              <span className="bg-accent/20 rounded-lg px-2 box-decoration-clone">
                Es un sistema que no pueda fallar.
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-neutral-300 mb-6 max-w-lg">
              Basado en el Principio de Pareto: el 20% de tus acciones genera el 80% de tu cambio.
              Sin gurus, sin 47 habitos a la vez, sin culpa cuando fallas un dia.
            </p>
            <p className="text-base mb-8">
              Hoy, eso podria ser <span className="font-bold text-accent">5 sentadillas.</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link href="/register" className="btn-primary">Empezar gratis</Link>
              <span className="border border-line text-neutral-500 text-xs uppercase tracking-widest py-2 px-5 rounded-full">
                iOS · pronto
              </span>
              <span className="border border-line text-neutral-500 text-xs uppercase tracking-widest py-2 px-5 rounded-full">
                Android · pronto
              </span>
            </div>
            <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
              Ya tengo cuenta
            </Link>
          </Reveal>

          <div className="relative h-[420px] hidden md:block">
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(227,201,160,0.18) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: "radial-gradient(circle at 60% 40%, rgba(227,201,160,0.15), transparent 60%)",
              }}
            />
            <FloatingStat icon="🔥" value="Dia 1" label="Racha" className="top-6 left-2 -rotate-6" />
            <FloatingStat icon="⏱️" value="1 habito" label="Hoy" className="top-40 right-2 rotate-3" />
            <FloatingStat icon="🎯" value="7/10" label="Wheel of life" className="bottom-10 left-10 -rotate-3" />
          </div>
        </div>
      </div>

      <MarqueeTicker />

      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-center py-16 md:py-24">
          <Reveal>
            <p className="kicker">🌐 Ahora en la web</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
              Sin descargas. Sin App Store. <span className="text-accent">Solo un link.</span>
            </h2>
            <p className="text-sm leading-relaxed text-neutral-300 mb-8 max-w-lg">
              Es la app completa, corriendo en tu navegador. Abrela en la laptop en el almuerzo,
              en el celular apenas despiertas, en la tablet antes de dormir. Tu racha y tu
              progreso te siguen a ti, no al aparato.
            </p>
            <div className="flex flex-col gap-6 mb-8">
              {WEB_FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <span className="text-xl leading-none mt-0.5">{f.icon}</span>
                  <div>
                    <p className="font-bold">{f.title}</p>
                    <p className="muted mt-1">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/register" className="btn-primary inline-flex items-center gap-2">
              <span>▶</span> Lanzar la app
            </Link>
          </Reveal>

          <WebAppMockup />
        </div>
      </div>

      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">🎯 Como vemos las cosas</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              La forma <span className="text-accent">EJECUTA</span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              Tres ideas, nada mas. Empieza pequeño, sostenlo todos los dias, y disfrutalo.
              Si no es sostenible, no sirve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <PhoneMantra mantra={MANTRAS[11]} />
            <div className="flex flex-col gap-6">
              {PHILOSOPHY.map((item, i) => (
                <div key={item.title} className="card">
                  <p className="text-accent text-sm font-bold tracking-widest mb-2">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="font-extrabold text-xl mb-2">{item.title}</p>
                  <p className="muted">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="max-w-2xl mx-auto px-6">
        <div className="mb-24 mt-16">
          <p className="kicker">Por que lo hicimos</p>
          <WordReveal
            words={WHY_WE_BUILT_IT}
            className="text-2xl sm:text-3xl font-extrabold leading-snug tracking-tight"
          />
        </div>

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
                  <p className="font-bold text-lg">{step.title}</p>
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
                <p className="font-bold text-base mb-1">{item.q}</p>
                <p className="muted">{item.a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="border-t border-line pt-10 pb-10 text-center">
            <Link href="/register" className="btn-primary">Empezar gratis</Link>
            <p className="muted mt-6">Un sistema, no una promesa.</p>
          </div>
        </Reveal>

        <div className="pb-16 flex items-center justify-center gap-6 text-xs uppercase tracking-widest text-neutral-600">
          <Link href="/terminos" className="hover:text-neutral-400 transition-colors">Terminos</Link>
          <Link href="/privacidad" className="hover:text-neutral-400 transition-colors">Privacidad</Link>
        </div>
      </div>
    </main>
  );
}
