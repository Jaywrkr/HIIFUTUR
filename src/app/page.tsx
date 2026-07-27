import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { MANTRAS } from "@/lib/mantras";
import { Reveal } from "@/components/Reveal";
import { ScrollTextLine } from "@/components/ScrollTextLine";
import { WordReveal, type RevealWord } from "@/components/WordReveal";
import { MarqueeTicker } from "@/components/MarqueeTicker";
import { PhoneMantra } from "@/components/PhoneMantra";
import { Footer } from "@/components/Footer";
import { Testimonials } from "@/components/Testimonials";
import { JAY_RESULT_LINE } from "@/lib/constants";

const PHILOSOPHY = [
  {
    title: "Empieza tan pequeño que no puedas fallar",
    description: "Un hábito a la vez. Si necesitas fuerza de voluntad para hacerlo, está mal diseñado.",
  },
  {
    title: "La consistencia le gana a la intensidad",
    description: "Todos los días le gana a algunos días increíbles.",
  },
  {
    title: "Si no lo disfrutas, no dura",
    description: "Elige el hábito que se sienta bien sostener, no el que se ve mejor en redes.",
  },
  {
    title: "No te conviertas en otra persona",
    description: "Necesitas un entorno que haga más fácil volver, no una identidad nueva.",
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
    description: "Actívalos de a poco — el primero antes de pensar en el segundo. Marcarlos es literal: un tap, y lo que ya sostuviste sigue contando.",
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
      "Guía para encontrar tu hábito ancla",
      "Wheel of Life inicial",
      "Recordatorios para empezar",
    ],
    cta: "Empezar gratis",
    highlight: false,
  },
  {
    id: "mensual",
    label: "Mensual",
    price: "$6.99",
    unit: "/ mes",
    tagline: "$4.99/mes si activas en tus primeros 7 días — precio fijo mientras mantengas tu suscripción activa.",
    features: [
      "Todo el sistema, sin límite de tiempo",
      "Hasta 5 hábitos activos",
      "Wheel of Life cada 30 días",
      "Cancela cuando quieras",
    ],
    cta: "Ver mensual",
    highlight: false,
  },
  {
    id: "anual",
    label: "Anual",
    price: "$59",
    unit: "/ año",
    tagline: "$42/año si activas en tus primeros 7 días — precio fijo mientras mantengas tu suscripción activa.",
    features: [
      "Todo lo del plan mensual",
      "Ahorras más de 3 meses frente a pagar mes a mes",
      "Acceso prioritario a lo nuevo",
    ],
    cta: "Ver anual",
    highlight: true,
  },
];

const OLD_RULES = [
  "Ten más disciplina.",
  "Hazlo todo o no hagas nada.",
  "Siéntete culpable si fallas.",
  "Empieza de nuevo el lunes.",
];

const WHY_WE_BUILT_IT: RevealWord[] = [
  { text: "La" }, { text: "mayoría" }, { text: "de" }, { text: "las" }, { text: "apps" },
  { text: "de" }, { text: "hábitos" }, { text: "están" }, { text: "hechas" }, { text: "para" },
  { text: "que" }, { text: "te" }, { text: "sientas" }, { text: "culpable.", strike: true },
  { text: "Nosotros" }, { text: "hicimos" }, { text: "un" }, { text: "sistema" }, { text: "para" },
  { text: "que" }, { text: "sigas," }, { text: "aunque" }, { text: "falles." },
];

const FOR_YOU_IF = [
  "Ya sabes qué hacer, pero no logras sostenerlo sin pelear contigo.",
  MANTRAS[15], // "Te sientes mal porque sabes lo que se supone que debes hacer y no lo estás haciendo."
  "Ya intentaste apps de rachas, cursos que abandonas y productividad que te pide cambiar todo de golpe — no funcionó.",
];

const JAY_STORY = [
  "Lo viví yo.",
  "El Wheel of Life es la nota del 1 al 10 que le pongo a mi vida cada mes.",
  JAY_RESULT_LINE,
  "Esto es ese sistema. No una versión bonita de él.",
];

const FAQ = [
  {
    q: "¿Cuánto tiempo toma al día?",
    a: "El que tú elijas para tu primer hábito. Puede ser literalmente 2 minutos.",
  },
  {
    q: "¿Necesito comprar algo?",
    a: "No para empezar — tienes 7 días gratis, sin tarjeta, con el sistema completo. Si decides seguir dentro de esos 7 días, desbloqueas el precio fundador, fijo mientras mantengas tu suscripción activa; si no, el precio regular es $6.99/mes o $59/año.",
  },
  {
    q: "¿Y si fallo un día?",
    a: "No pasa nada. Tienes hasta 2 fallos dentro de cada ciclo de 30 días — el tercero lo reinicia, pero no pierdes todo: conservas la mitad de tus puntos y tus respuestas siguen escritas.",
  },
  {
    q: "¿Esto es otro curso que voy a abandonar?",
    a: "Puede ser. Depende de si empiezas tan pequeño que sea imposible fallar. Por eso el sistema está diseñado así, no al revés.",
  },
  {
    q: "¿Qué pasa después de crear mi cuenta?",
    a: "Primero mides cómo está tu vida hoy con el Wheel of Life. Después haces el primer módulo. Entonces eliges tu hábito ancla: pequeño, concreto y sostenible.",
  },
];

function FloatingStat({
  label,
  value,
  className,
  rotate,
  duration,
  delay,
}: {
  label: string;
  value: string;
  className: string;
  rotate: string;
  duration: string;
  delay: string;
}) {
  return (
    <div
      className={`float-card absolute bg-surface border border-line rounded-lg px-5 py-4 shadow-lg shadow-black/20 ${className}`}
      style={
        {
          "--float-rot": rotate,
          "--float-duration": duration,
          "--float-delay": delay,
        } as React.CSSProperties
      }
    >
      <p className="font-bold leading-tight text-xl">{value}</p>
      <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{label}</p>
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
        <span className="inline-flex items-center gap-2.5 text-sm font-normal tracking-[0.3em] text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0 breathing-dot" aria-hidden="true" />
          EJECUTA
        </span>
        <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
          Iniciar sesión
        </Link>
      </div>

      {/* Hero: two columns, full width, floating stat mockups on the right
          (illustrative example data, not a claim about any real user). */}
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-center py-14 md:py-28">
          <Reveal>
            <p className="kicker">Sistema de ejecución sostenible</p>
            <h1 className="text-4xl sm:text-5xl font-thin leading-[1.3] tracking-tight mb-5">
              No es disciplina. No es fuerza de voluntad.{" "}
              <span className="text-accent font-black">Es un sistema que no pueda fallar.</span>
            </h1>
            <p className="text-sm leading-relaxed text-neutral-400 mb-8 max-w-lg">
              Basado en el Principio de Pareto: el 20% de tus acciones genera el 80% de tu cambio.
              Menos acciones. Menos culpa. Más continuidad. Sin gurús, sin 47 hábitos a la vez.
            </p>
            <p className="text-base mb-2">
              Hoy, eso podría ser <span className="font-semibold text-accent">5 sentadillas.</span>
            </p>
            <p className="text-sm text-neutral-500 mb-10">
              Empieza con algo que puedas hacer incluso en un día malo.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/register" className="btn-primary">Empezar gratis</Link>
              <Link href="/login" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
                Ya tengo cuenta
              </Link>
            </div>
            <p className="text-xs text-neutral-500 mt-4">
              7 días gratis. Sin tarjeta. Primero mides dónde estás.
            </p>
            <p className="text-xs text-neutral-400 mt-2">iOS y Android, pronto.</p>
          </Reveal>

          <div className="relative h-[420px] hidden md:block" aria-hidden="true">
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.06), transparent 65%)",
              }}
            />
            <FloatingStat
              value="Día 1"
              label="Racha"
              className="top-6 left-2"
              rotate="-6deg"
              duration="6.5s"
              delay="0s"
            />
            <FloatingStat
              value="1 hábito"
              label="Hoy"
              className="top-40 right-2"
              rotate="3deg"
              duration="7.5s"
              delay="0.6s"
            />
            <FloatingStat
              value="7/10"
              label="Wheel of life"
              className="bottom-10 left-10"
              rotate="-3deg"
              duration="7s"
              delay="1.2s"
            />
          </div>
        </div>
      </div>

      <MarqueeTicker />

      {/* Agitación: las reglas que ya te dijeron, y que no funcionaron —
          entra antes de pedirte nada, para que el resto tenga contexto. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 text-center">
          <p className="kicker mx-auto">Las reglas viejas</p>
          <p className="text-sm text-neutral-400 mb-10">Por años te dijeron...</p>

          <div className="flex flex-col gap-1 mb-10">
            {OLD_RULES.map((rule) => (
              <p
                key={rule}
                className="text-2xl sm:text-4xl font-thin uppercase tracking-tight text-neutral-500 line-through decoration-neutral-400/60"
                style={{ textDecorationThickness: "3px" }}
              >
                {rule}
              </p>
            ))}
          </div>

          <p className="text-sm text-neutral-400 mb-6">
            Y de alguna forma... sigues sin sostener nada.
          </p>
          <p className="text-2xl sm:text-3xl font-thin leading-relaxed mb-6">
            Tal vez el problema no eres tu.{" "}
            <span className="text-accent">Tal vez son las reglas.</span>
          </p>
          <p className="text-sm text-neutral-400">
            Aquí fallar no te expulsa. Solo te dice cómo volver más pequeño.
          </p>
        </div>
      </Reveal>

      {/* Credibilidad: por qué lo hicimos, quién lo escribió, para quién es,
          y el truco central (hábito ancla) — todo en un mismo bloque. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">Por qué lo hicimos</p>
            <WordReveal
              words={WHY_WE_BUILT_IT}
              className="text-3xl sm:text-4xl font-thin leading-relaxed tracking-tight max-w-3xl mx-auto"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center mb-16">
            <PhoneMantra mantra={MANTRAS[9]} />
            <div>
              <p className="kicker">No lo escribió un equipo de marketing</p>
              <div className="border-l-2 border-l-accent pl-6 flex flex-col gap-4 mt-4">
                {JAY_STORY.map((line) => (
                  <ScrollTextLine key={line}>
                    <span className="text-lg font-normal leading-snug">{line}</span>
                  </ScrollTextLine>
                ))}
                <p className="text-xs uppercase tracking-widest text-neutral-500 mt-2">— Jay</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <p className="kicker">Esto es para ti si...</p>
              <div className="flex flex-col gap-1 mt-4">
                {FOR_YOU_IF.map((line) => (
                  <div key={line} className="group flex items-start gap-3 border-b border-line py-3 last:border-b-0">
                    <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">—</span>
                    <p className="text-sm text-neutral-300 group-hover:text-white transition-colors">{line}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="lift-on-hover rounded-lg border border-accent/50 p-6 flex flex-col justify-center">
              <p className="kicker">El truco</p>
              <p className="font-bold text-2xl mb-2">Encuentra tu hábito ancla</p>
              <p className="muted mb-3">
                El único hábito que, sostenido, jala a todos los demás. No es el más vistoso —
                es el que arrastra al resto.
              </p>
              <p className="muted mb-2">
                No eliges un hábito en abstracto. Lo amarras a un momento real de tu día.
              </p>
              <p className="text-xs text-neutral-500">
                Por ejemplo: después del café. Antes de la ducha. Al cerrar la laptop.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* La filosofía: la respuesta corta a "por qué esto sí funciona". */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">Cómo vemos las cosas</p>
            <h2 className="text-4xl sm:text-5xl font-thin tracking-tight mb-4">
              La forma <span className="text-accent">EJECUTA</span>
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              Tres ideas. Si no es sostenible, no sirve.
            </p>
          </div>

          <div className="max-w-2xl mx-auto border-t border-line">
            {PHILOSOPHY.map((item, i) => (
              <Reveal key={item.title} delay={i * 120}>
                <div className="border-b border-line py-6 flex gap-5">
                  <p className="text-accent text-sm font-semibold tracking-widest shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <p className="font-bold text-xl mb-2">{item.title}</p>
                    <p className="muted">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* El sistema por dentro, en el mismo lenguaje que usa la app una vez
          adentro: Aprendizaje + Acción + Control. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32">
          <p className="kicker">Cómo funciona, en 3 partes</p>
          <h2 className="text-4xl sm:text-5xl font-thin tracking-tight mb-4">
            Aprendizaje. Acción. Control.
          </h2>
          <p className="text-sm leading-relaxed text-neutral-300 max-w-xl mb-12">
            No es otro tracker. Es una secuencia guiada: miras tu vida, aprendes una idea, ejecutas
            una acción pequeña y revisas sin castigarte. Curso, hábitos y Wheel of Life no son tres
            apps distintas — son las tres partes del mismo sistema, no porque te obliguen, sino
            porque ya es parte de tu día.
          </p>

          <div className="flex flex-col md:flex-row md:items-stretch gap-3 mb-6">
            {SYSTEM_PARTS.map((part, i) => (
              <div key={part.kicker} className="flex items-center gap-3 flex-1">
                <Reveal delay={i * 150}>
                  <div className="card h-full">
                    <p className="kicker">{part.kicker}</p>
                    <p className="font-bold text-2xl mb-2">{part.title}</p>
                    <p className="muted">{part.description}</p>
                  </div>
                </Reveal>
                {i < SYSTEM_PARTS.length - 1 ? (
                  <span className="hidden md:block text-accent/50 text-2xl shrink-0" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="lift-on-hover rounded-lg border border-accent/50 p-6">
            <p className="kicker">Tu ritmo</p>
            <p className="font-bold text-2xl mb-2">A tu ritmo, con puntos por avanzar</p>
            <p className="muted">Los puntos son señal de avance, no una deuda. Tu progreso sigue siendo tuyo — el leaderboard es opcional, no un feed de lo que hacen los demás.</p>
          </div>
        </div>
      </Reveal>

      <Testimonials />

      {/* El pedido: ahora que ya construimos confianza y explicamos el
          sistema, recién aquí llega el precio. */}
      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32 text-center">
          <p className="kicker mx-auto">Empieza donde estés</p>
          <h2 className="text-4xl sm:text-5xl font-thin tracking-tight mb-4">
            Elige tu plan. Empieza tu sistema.
          </h2>
          <p className="text-sm text-neutral-400 max-w-xl mx-auto mb-2">
            7 días de prueba completa, sin tarjeta. Si decides seguir durante tu prueba,
            desbloqueas precio fundador — fijo mientras mantengas tu suscripción activa. Después
            de la prueba, el precio regular es $6.99/mes o $59/año.
          </p>
          <p className="text-xs text-neutral-500 max-w-xl mx-auto mb-12">
            No eliges plan todavía. Primero entras a la prueba gratis.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`lift-on-hover relative rounded-lg p-6 flex flex-col border bg-surface ${
                  plan.highlight ? "border-accent/60" : "border-line"
                }`}
              >
                {plan.highlight ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-black text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                    Mejor valor
                  </span>
                ) : null}
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-4">{plan.label}</p>
                <p className="mb-1">
                  <span className="text-4xl font-bold">{plan.price}</span>{" "}
                  <span className="text-sm text-neutral-400">{plan.unit}</span>
                </p>
                <p className="muted mb-6">{plan.tagline}</p>
                <div className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">✓</span>
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

          <p className="text-xs text-neutral-400 max-w-lg mx-auto mt-10">
            Cancela cuando quieras desde Mi cuenta. El pago se procesa por PayPal — puedes pagar
            con tu cuenta PayPal o con tarjeta sin tener una.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 md:py-32">
          <div className="text-center mb-16">
            <p className="kicker mx-auto">Preguntas que te estás haciendo</p>
            <h2 className="text-4xl sm:text-5xl font-thin tracking-tight">
              Ya sé qué estás pensando
            </h2>
          </div>
          <div className="border-t border-line">
            {FAQ.map((item, i) => (
              <Reveal key={item.q} delay={i * 100}>
                <div className="border-b border-line py-6 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-10">
                  <p className="font-bold text-base sm:w-80 shrink-0">{item.q}</p>
                  <p className="muted">{item.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="max-w-2xl mx-auto px-6 border-t border-line pt-10 pb-10 text-center">
          <Link href="/register" className="btn-primary">Empezar gratis</Link>
          <p className="muted mt-6">Un sistema, no una promesa.</p>
          <p className="text-xs text-neutral-600 mt-2">
            Sin tarjeta para empezar. Sin testimonios inventados. Sin prometerte una vida nueva en
            siete días.
          </p>
        </div>
      </Reveal>

      <Footer />
    </main>
  );
}
