import type { Metadata } from "next";
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
import { Footer } from "@/components/Footer";

const PHILOSOPHY = [
  {
    title: "Empieza tan pequeño que no puedas fallar",
    description: "Un hábito a la vez. Si necesitas fuerza de voluntad para hacerlo, está mal diseñado.",
  },
  {
    title: "La consistencia le gana a la intensidad",
    description: "Todos los días le gana a algunos días increíbles. El sistema premia mostrarte, no rendir al máximo.",
  },
  {
    title: "Si no lo disfrutas, no dura",
    description: "Elige el hábito que se sienta bien sostener, no el que se ve mejor en redes.",
  },
];

const WEB_FEATURES = [
  {
    icon: "⚡",
    title: "Cero instalación",
    description: "Abres el link y ya. Nada que descargar, nada que actualizar, nada que te pida espacio en el celular.",
  },
  {
    icon: "🔁",
    title: "Tu progreso te sigue a ti",
    description: "Empieza en el celular, sigue en la laptop, ciérralo en la tablet antes de dormir. La cuenta es tuya, no del aparato.",
  },
];

const SYSTEM_PARTS = [
  {
    kicker: "Aprendizaje",
    title: "11 módulos, en partes chicas",
    description: "Basados en el Principio de Pareto. Ninguno te toma una tarde entera — los ganas con tu propia ejecución, no leyéndolos de corrido.",
  },
  {
    kicker: "Acción",
    title: "Hasta 5 hábitos, uno a la vez",
    description: "Actívalos de a poco — el primero antes de pensar en el segundo. Marcarlos es literal: un tap, y tu racha sigue viva.",
  },
  {
    kicker: "Control",
    title: "Wheel of Life cada 30 días",
    description: "Una foto honesta de las áreas que elegiste. No es examen, es brújula — te dice hacia dónde te estás moviendo.",
  },
];

const PRICING_PLANS = [
  {
    id: "prueba",
    label: "Prueba gratis",
    price: "$0",
    unit: "7 días",
    tagline: "Sin tarjeta.",
    features: [
      "Los 11 módulos completos",
      "Tu hábito ancla activo",
      "Wheel of Life inicial",
      "Recordatorios diarios",
    ],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    id: "mensual",
    label: "Mensual",
    price: "$6.99",
    unit: "/ mes",
    tagline: "$4.99/mes si activas en tus primeros 7 días — precio fijo para siempre.",
    features: [
      "Todo el sistema, sin límite de tiempo",
      "Hasta 5 hábitos activos",
      "Wheel of Life cada 30 días",
      "Cancela cuando quieras",
    ],
    cta: "Empezar mensual",
    highlight: false,
  },
  {
    id: "anual",
    label: "Anual",
    price: "$59",
    unit: "/ año",
    tagline: "$42/año si activas en tus primeros 7 días — precio fijo para siempre.",
    features: [
      "Todo lo del plan mensual",
      "Casi 2 meses gratis vs. pagar mes a mes",
      "Acceso prioritario a lo nuevo",
    ],
    cta: "Empezar anual",
    highlight: true,
  },
];

const OLD_RULES = [
  "Ten más disciplina.",
  "Levantate a las 5am.",
  "Hazlo todo o no hagas nada.",
  "Sientete culpable si fallas.",
  "Empieza de nuevo el lunes.",
  "Repite.",
];

const WHY_WE_BUILT_IT: RevealWord[] = [
  { text: "La" }, { text: "mayoría" }, { text: "de" }, { text: "las" }, { text: "apps" },
  { text: "de" }, { text: "hábitos" }, { text: "están" }, { text: "hechas" }, { text: "para" },
  { text: "que" }, { text: "te" }, { text: "sientas" }, { text: "culpable.", strike: true },
  { text: "Nosotros" }, { text: "hicimos" }, { text: "un" }, { text: "sistema" }, { text: "para" },
  { text: "que" }, { text: "sigas," }, { text: "aunque" }, { text: "falles." },
];

const FOR_YOU_IF = [
  "Ya intentaste 100 apps de hábitos y las dejaste en la semana 2.",
  MANTRAS[15], // "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estás haciendo."
  "Cada lunes prometes empezar de nuevo — y cada lunes se siente igual de lejos.",
  "Quieres resultados reales, no una racha de emojis.",
];

const JAY_STORY = [
  "Lo viví yo.",
  "El Wheel of Life es la nota del 1 al 10 que le pongo a mi vida cada mes: salud, trabajo, relaciones, dinero, mentalidad.",
  "En 8 meses, mi promedio pasó de un 3 a un 9.",
  "No fue un giro de 180 grados de un día para otro.",
  "Fue un sistema pequeño, sostenido, mes tras mes.",
  "Esto es ese sistema. No una versión bonita de él.",
];

const FAQ = [
  {
    q: "¿Cuánto tiempo toma al día?",
    a: "El que tú elijas para tu primer hábito. Puede ser literalmente 2 minutos.",
  },
  {
    q: "¿Necesito comprar algo?",
    a: "No para empezar — tienes 7 días gratis, sin tarjeta, con el sistema completo. Si decides seguir, activas un plan pago; si activas dentro de esos 7 días, te queda un precio más bajo para siempre.",
  },
  {
    q: "¿Y si fallo un día?",
    a: "No pasa nada. Tienes hasta 2 fallos dentro de cada ciclo de 30 días — el tercero lo reinicia, pero no pierdes todo: conservas la mitad de tus puntos y tus respuestas siguen escritas.",
  },
  {
    q: "¿Esto es otro curso que voy a abandonar?",
    a: "Puede ser. Depende de si empiezas tan pequeño que sea imposible fallar. Por eso el sistema está diseñado así, no al revés.",
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

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EJECUTA",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  description:
    "Curso interactivo basado en el Principio de Pareto, con seguimiento de hábitos y Wheel of Life — sistema de ejecución sostenible.",
  offers: PRICING_PLANS.filter((p) => p.id !== "prueba").map((p) => ({
    "@type": "Offer",
    name: p.label,
    price: p.price.replace("$", ""),
    priceCurrency: "USD",
  })),
};

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.3em] text-white">EJECUTA</span>
        <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
          Iniciar sesión
        </Link>
      </div>

      {/* Hero: two columns, full width, floating stat mockups on the right
          (illustrative example data, not a claim about any real user). */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-center py-10 md:py-20">
          <Reveal>
            <p className="kicker">Sistema de ejecución sostenible</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
              No es disciplina. No es fuerza de voluntad.{" "}
              <span className="bg-accent/20 rounded-lg px-2 box-decoration-clone">
                Es un sistema que no pueda fallar.
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-neutral-300 mb-6 max-w-lg">
              Basado en el Principio de Pareto: el 20% de tus acciones genera el 80% de tu cambio.
              Sin gurús, sin 47 hábitos a la vez, sin culpa cuando fallas un día.
            </p>
            <p className="text-base mb-8">
              Hoy, eso podría ser <span className="font-bold text-accent">5 sentadillas.</span>
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
            <FloatingStat icon="🔥" value="Día 1" label="Racha" className="top-6 left-2 -rotate-6" />
            <FloatingStat icon="⏱️" value="1 hábito" label="Hoy" className="top-40 right-2 rotate-3" />
            <FloatingStat icon="🎯" value="7/10" label="Wheel of life" className="bottom-10 left-10 -rotate-3" />
          </div>
        </div>
      </div>

      <MarqueeTicker />

      {/* Agitación: las reglas que ya te dijeron, y que no funcionaron —
          entra antes de pedirte nada, para que el resto tenga contexto. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="kicker mx-auto">🚫 Las reglas viejas</p>
          <p className="text-sm text-neutral-400 mb-10">Por años te dijeron...</p>

          <div className="flex flex-col gap-1 mb-10">
            {OLD_RULES.map((rule) => (
              <p
                key={rule}
                className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-neutral-700 line-through decoration-red-500/70"
                style={{ textDecorationThickness: "3px" }}
              >
                {rule}
              </p>
            ))}
          </div>

          <p className="text-sm text-neutral-400 mb-6">
            Y de alguna forma... sigues sin sostener nada.
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold leading-snug">
            Tal vez el problema no eres tu.{" "}
            <span className="text-accent">Tal vez son las reglas.</span>
          </p>
        </div>
      </Reveal>

      {/* Credibilidad: por qué lo hicimos, quién lo escribió, para quién es,
          y el truco central (hábito ancla) — todo en un mismo bloque. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">💭 Por qué lo hicimos</p>
            <WordReveal
              words={WHY_WE_BUILT_IT}
              className="text-3xl sm:text-4xl font-extrabold leading-snug tracking-tight max-w-3xl mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <PhoneMantra mantra={MANTRAS[9]} />
            <div>
              <p className="kicker">No lo escribió un equipo de marketing</p>
              <div className="border-l-2 border-l-accent pl-6 flex flex-col gap-4 mt-4">
                {JAY_STORY.map((line) => (
                  <ScrollTextLine key={line}>
                    <span className="text-lg font-bold leading-snug">{line}</span>
                  </ScrollTextLine>
                ))}
                <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">— Jay</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <p className="kicker">Esto es para ti si...</p>
              <div className="flex flex-col gap-1 mt-4">
                {FOR_YOU_IF.map((line) => (
                  <div key={line} className="group flex items-start gap-3 border-b border-line py-3 last:border-b-0">
                    <span className="text-accent mt-0.5 shrink-0">—</span>
                    <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">{line}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-accent/15 border border-accent/40 p-6 flex flex-col justify-center">
              <p className="kicker">El truco</p>
              <p className="font-extrabold text-2xl mb-2">Encuentra tu hábito ancla</p>
              <p className="muted">
                El único hábito que, si lo sostienes, jala a todos los demás sin que hagas nada
                extra. No es el más vistoso ni el que más te emociona — es el que arrastra a los
                demás con que tú lo sostengas.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* La filosofía: la respuesta corta a "por qué esto sí funciona". */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">🎯 Cómo vemos las cosas</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
              La forma <span className="text-accent">EJECUTA</span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              Tres ideas, nada más. Empieza pequeño, sostenlo todos los días, y disfrutalo.
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

      {/* Encaje práctico: dónde vive esto (la web app), antes de entrar al
          detalle de cómo está armado por dentro. */}
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

      {/* El sistema por dentro, en el mismo lenguaje que usa la app una vez
          adentro: Aprendizaje + Acción + Control. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <p className="kicker">🧭 Cómo funciona, en 3 partes</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Aprendizaje. Acción. Control.
          </h2>
          <p className="text-sm leading-relaxed text-neutral-300 max-w-xl mb-12">
            Curso, hábitos y Wheel of Life no son tres apps distintas — son las tres partes del
            mismo sistema. Aprendes, actúas, mides, y repites, no porque te obliguen, sino porque
            ya es parte de tu día.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <p className="kicker">{SYSTEM_PARTS[0].kicker}</p>
              <p className="font-extrabold text-2xl mb-2">{SYSTEM_PARTS[0].title}</p>
              <p className="muted">{SYSTEM_PARTS[0].description}</p>
            </div>
            <div className="card">
              <p className="kicker">{SYSTEM_PARTS[1].kicker}</p>
              <p className="font-extrabold text-2xl mb-2">{SYSTEM_PARTS[1].title}</p>
              <p className="muted">{SYSTEM_PARTS[1].description}</p>
            </div>
            <div className="card">
              <p className="kicker">{SYSTEM_PARTS[2].kicker}</p>
              <p className="font-extrabold text-2xl mb-2">{SYSTEM_PARTS[2].title}</p>
              <p className="muted">{SYSTEM_PARTS[2].description}</p>
            </div>
            <div className="rounded-3xl bg-accent/15 border border-accent/40 p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1">
                <p className="kicker">Tu ritmo</p>
                <p className="font-extrabold text-2xl mb-2">A tu ritmo, con puntos por avanzar</p>
                <p className="muted">Cada hábito marcado suma puntos y te acerca al siguiente nivel. Tu racha sigue siendo tuya — el leaderboard es opcional, no un feed de lo que hacen los demás.</p>
              </div>
              <PhoneMantra mantra={MANTRAS[4]} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* El pedido: ahora que ya construimos confianza y explicamos el
          sistema, recién aquí llega el precio. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 text-center">
          <p className="kicker mx-auto">💪 Empieza donde estes</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Elige tu plan. Empieza tu sistema.
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-12">
            Empieza gratis para probarlo. Los planes pagos son para quien quiere apoyar
            directamente el desarrollo — hoy tienen las mismas funciones que el gratis.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col ${
                  plan.highlight
                    ? "bg-accent/15 border border-accent/40"
                    : "border border-line bg-surface"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Mejor valor
                  </span>
                ) : null}
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">{plan.label}</p>
                <p className="mb-1">
                  <span className="text-4xl font-extrabold">{plan.price}</span>{" "}
                  <span className="text-sm text-neutral-400">{plan.unit}</span>
                </p>
                <p className="muted mb-6">{plan.tagline}</p>
                <div className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5 shrink-0">✓</span>
                      <span className="text-sm text-neutral-300">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className={plan.highlight ? "btn-primary text-center" : "btn-secondary text-center"}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-xs text-neutral-600 max-w-lg mx-auto mt-10">
            Los cobros todavía no están activos. Cualquier plan que elijas hoy crea tu cuenta
            gratis — te avisamos apenas el pago este disponible.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">❓ Preguntas que te estás haciendo</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Ya sé qué estás pensando
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {FAQ.map((item) => (
              <div key={item.q} className="card">
                <p className="font-bold text-base mb-1">{item.q}</p>
                <p className="muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="max-w-2xl mx-auto px-6 border-t border-line pt-10 pb-10 text-center">
          <Link href="/register" className="btn-primary">Empezar gratis</Link>
          <p className="muted mt-6">Un sistema, no una promesa.</p>
        </div>
      </Reveal>

      <Footer />
    </main>
  );
}
