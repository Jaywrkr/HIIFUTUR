const ITEMS = [
  { icon: "🧘", label: "Respirar 1 min" },
  { icon: "🚶", label: "Caminar 10 min" },
  { icon: "💧", label: "Tomar agua" },
  { icon: "📓", label: "Escribir 1 linea" },
  { icon: "🛌", label: "Dormir a tiempo" },
  { icon: "🏋️", label: "5 sentadillas" },
];

function TickerContent() {
  return (
    <>
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center gap-3 shrink-0 px-6">
          <span className="text-lg">{item.icon}</span>
          <span className="text-sm font-bold uppercase tracking-widest text-neutral-300">
            {item.label}
          </span>
          <span className="text-accent">✦</span>
        </span>
      ))}
    </>
  );
}

export function MarqueeTicker() {
  return (
    <div className="w-full overflow-hidden border-y border-line bg-surface/40 py-4">
      <div className="marquee-track flex w-max">
        <TickerContent />
        <TickerContent />
      </div>
    </div>
  );
}
