import type { ConceptKey } from "@/lib/modules-content";
import { MODULES } from "@/lib/modules-content";

// Small, self-contained illustrations — one per module — that make each
// core idea click at a glance before the exercise. Pure CSS/SVG, no client
// JS, theme-agnostic (they live on the dark app shell).

export function ConceptFrame({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 mb-8">
      <p className="text-xs uppercase tracking-widest text-accent mb-4">Idea clave</p>
      <div className="mb-4">{children}</div>
      <p className="text-sm text-neutral-300 leading-relaxed">{caption}</p>
    </div>
  );
}

function WillpowerBattery() {
  const segments = [
    { pct: 100, on: true },
    { pct: 80, on: true },
    { pct: 60, on: true },
    { pct: 40, on: false },
    { pct: 20, on: false },
  ];
  const labels = ["6am", "10am", "1pm", "5pm", "9pm"];
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-1.5 rounded-lg border-2 border-neutral-600 p-1.5">
          {segments.map((s, i) => (
            <div
              key={i}
              className={`h-8 flex-1 rounded ${
                s.on ? (i < 2 ? "bg-accent" : "bg-accent/50") : "bg-neutral-800"
              }`}
            />
          ))}
        </div>
        <div className="w-1.5 h-5 rounded-r bg-neutral-600" />
      </div>
      <div className="flex justify-between mt-2 px-1">
        {labels.map((l) => (
          <span key={l} className="text-[10px] uppercase tracking-widest text-neutral-400">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

function Pareto8020() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Tus acciones</p>
        <div className="flex h-8 rounded-lg overflow-hidden border border-line">
          <div className="w-[20%] bg-accent flex items-center justify-center text-[10px] font-bold text-black">
            20%
          </div>
          <div className="w-[80%] bg-neutral-800" />
        </div>
      </div>
      <div className="flex justify-center text-accent text-lg">↓</div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-1">Tus resultados</p>
        <div className="flex h-8 rounded-lg overflow-hidden border border-line">
          <div className="w-[80%] bg-accent flex items-center justify-center text-[10px] font-bold text-black">
            80%
          </div>
          <div className="w-[20%] bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

function GoalVsSystem() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-line p-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3">La meta</p>
        <div className="relative h-10 flex items-center">
          <div className="h-px w-full bg-neutral-700" />
          <span className="absolute right-0 w-3 h-3 rounded-full bg-neutral-500" />
        </div>
        <p className="text-xs text-neutral-500 mt-2">Un punto lejano</p>
      </div>
      <div className="rounded-xl border border-accent/40 p-4 text-center">
        <p className="text-[10px] uppercase tracking-widest text-accent mb-3">El sistema</p>
        <div className="h-10 flex items-center justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="w-3 h-3 rounded-full bg-accent" />
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-2">Cada día, igual</p>
      </div>
    </div>
  );
}

function NeverTwice() {
  const row = (pattern: boolean[], ok: boolean, label: string) => (
    <div>
      <div className="flex gap-1.5 mb-1">
        {pattern.map((hit, i) => (
          <span
            key={i}
            className={`w-6 h-6 rounded flex items-center justify-center text-xs ${
              hit ? "bg-accent text-black" : "border border-neutral-700 text-neutral-500"
            }`}
          >
            {hit ? "✓" : "·"}
          </span>
        ))}
      </div>
      <p className={`text-xs ${ok ? "text-accent" : "text-red-400"}`}>{label}</p>
    </div>
  );
  return (
    <div className="flex flex-col gap-4">
      {row([true, true, false, true, true], true, "Un fallo suelto: el sistema sigue vivo.")}
      {row([true, true, false, false, false], false, "Dos seguidos: ahí empieza a romperse.")}
    </div>
  );
}

function AnchorCascade() {
  // Same chain as the module's own example ("dormir a una hora fija" ->
  // energía -> entrenamiento -> ánimo -> relaciones): a real downstream
  // cascade, not a hub fanning out to unrelated things — each step down
  // and to the right, fading, is the one hábito ancla rippling outward.
  const chain = ["Dormir a una hora fija", "Energía", "Entrenamiento", "Ánimo", "Relaciones"];
  return (
    <div className="flex flex-col gap-2">
      {chain.map((item, i) => (
        <div key={item} className="flex items-center gap-2" style={{ marginLeft: `${i * 18}px` }}>
          {i > 0 ? <span className="text-accent text-sm shrink-0">↳</span> : null}
          <span
            className={`rounded-lg text-xs px-3 py-2 shrink-0 ${
              i === 0
                ? "bg-accent text-black font-bold"
                : "border text-neutral-300"
            }`}
            style={i === 0 ? undefined : { borderColor: `rgba(227,201,160,${0.45 - i * 0.08})` }}
          >
            {i === 0 ? `Ancla · ${item}` : item}
          </span>
        </div>
      ))}
    </div>
  );
}

function IdentityVotes() {
  return (
    <div>
      <div className="flex items-end gap-[3px] h-12 mb-2">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className={`flex-1 rounded-sm ${i < 14 ? "bg-accent" : "bg-neutral-800"}`}
            style={{ height: `${i < 14 ? 100 : 30}%` }}
          />
        ))}
      </div>
      <p className="text-[10px] uppercase tracking-widest text-neutral-500">
        Cada check = un voto por quién eres
      </p>
    </div>
  );
}

function FrictionMeter() {
  const bar = (label: string, filled: number, accent: boolean) => (
    <div>
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-neutral-500 mb-1">
        <span>{label}</span>
        <span>{filled === 5 ? "Alta" : "Baja"}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 rounded-full ${
              i < filled ? (accent ? "bg-accent" : "bg-red-500/70") : "bg-neutral-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
  return (
    <div className="flex flex-col gap-4">
      {bar("Sin diseñar tu entorno", 5, false)}
      {bar("Con el entorno a tu favor", 1, true)}
    </div>
  );
}

function TwoStories() {
  return (
    <div>
      <p className="text-center text-xs text-neutral-400 mb-3">Fallaste un día. Aquí se bifurca:</p>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-center">
          <p className="text-xs font-bold text-red-400 mb-1">&ldquo;Ya la regué&rdquo;</p>
          <p className="text-[11px] text-neutral-500">→ semanas fuera</p>
        </div>
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-3 text-center">
          <p className="text-xs font-bold text-accent mb-1">&ldquo;Un día, no un mes&rdquo;</p>
          <p className="text-[11px] text-neutral-400">→ mañana retomo</p>
        </div>
      </div>
    </div>
  );
}

function HabitChain() {
  const links = ["Hábito ya firme", "+ nuevo", "+ otro"];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {links.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 ? <span className="text-accent text-sm">⛓</span> : null}
          <span
            className={`rounded-full text-xs px-3 py-2 ${
              i === 0
                ? "bg-accent text-black font-bold"
                : "border border-accent/40 text-neutral-300"
            }`}
          >
            {l}
          </span>
        </span>
      ))}
    </div>
  );
}

function Compass() {
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 80 80" className="w-20 h-20 shrink-0">
        <circle cx="40" cy="40" r="36" fill="none" stroke="#2B241C" strokeWidth="2" />
        <circle cx="40" cy="40" r="3" fill="#E3C9A0" />
        <polygon points="40,12 46,40 40,36 34,40" fill="#E3C9A0" />
        <polygon points="40,68 46,40 40,44 34,40" fill="#6b6153" />
        {["N", "S", "E", "O"].map((d, i) => (
          <text
            key={d}
            x={i === 0 ? 40 : i === 1 ? 40 : i === 2 ? 70 : 10}
            y={i === 0 ? 9 : i === 1 ? 76 : 44}
            fontSize="8"
            fill="#a89a85"
            textAnchor="middle"
          >
            {d}
          </text>
        ))}
      </svg>
      <p className="text-xs text-neutral-400 leading-relaxed">
        No mide qué tan &ldquo;bueno&rdquo; eres. Solo te dice hacia dónde te estás moviendo — para
        decidir el próximo mes.
      </p>
    </div>
  );
}

function MantraCollection() {
  return (
    <div className="flex flex-col gap-2">
      {MODULES.map((m) => (
        <div key={m.id} className="flex gap-3 items-start">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 shrink-0 mt-1 w-6">
            {m.order}
          </span>
          <p className="text-xs text-neutral-400 italic leading-snug">
            &ldquo;{m.mantra.length > 90 ? m.mantra.slice(0, 88) + "…" : m.mantra}&rdquo;
          </p>
        </div>
      ))}
    </div>
  );
}

export const CONCEPT_CAPTIONS: Record<ConceptKey, string> = {
  "willpower-battery":
    "Tu fuerza de voluntad es una batería que se descarga durante el día. Un buen sistema no depende de que esté llena.",
  "pareto-8020":
    "Un puñado de tus acciones (el 20%) genera casi todo tu resultado (el 80%). Encontrar y proteger ese 20% es todo el juego.",
  "goal-vs-system":
    "La meta te dice a dónde. El sistema te dice qué hacer hoy. Las metas apuntan; los sistemas cambian tu vida.",
  "never-twice":
    "Fallar un día no rompe nada. Fallar dos seguidos convierte 'una excepción' en 'así soy ahora'. Esa es la única regla dura.",
  "anchor-cascade":
    "El hábito ancla no mejora un área: jala a varias en cascada, sin que trabajes en cada una por separado.",
  "identity-votes":
    "Cada check no es 'ya lo hice hoy'. Es un voto por el tipo de persona que estás construyendo, uno a la vez.",
  "friction-meter":
    "La fuerza de voluntad pierde contra un entorno mal diseñado. Baja la fricción y el hábito casi se hace solo.",
  "two-stories":
    "No es el fallo lo que te saca del sistema: es la historia que te cuentas después. Elige la que te devuelve el poder.",
  "habit-chain":
    "Un hábito ya automático dispara al siguiente. Encadenas sin gastar más fuerza de voluntad ni depender de la memoria.",
  compass:
    "Tu Wheel of Life es una brújula, no un examen: compara mes contra mes y te dice si el sistema está funcionando.",
  "mantra-collection":
    "Estas son las frases que te acompañaron en cada módulo. Ahora te toca escribir la tuya — comprimir tu propia lección.",
};

export function ModuleConcept({ concept }: { concept: ConceptKey }) {
  const visual: Record<ConceptKey, React.ReactNode> = {
    "willpower-battery": <WillpowerBattery />,
    "pareto-8020": <Pareto8020 />,
    "goal-vs-system": <GoalVsSystem />,
    "never-twice": <NeverTwice />,
    "anchor-cascade": <AnchorCascade />,
    "identity-votes": <IdentityVotes />,
    "friction-meter": <FrictionMeter />,
    "two-stories": <TwoStories />,
    "habit-chain": <HabitChain />,
    compass: <Compass />,
    "mantra-collection": <MantraCollection />,
  };

  return <ConceptFrame caption={CONCEPT_CAPTIONS[concept]}>{visual[concept]}</ConceptFrame>;
}
