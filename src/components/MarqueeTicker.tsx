const ITEMS = [
  "Respirar 1 min",
  "Caminar 10 min",
  "Tomar agua",
  "Escribir 1 línea",
  "Dormir a tiempo",
  "5 sentadillas",
];

function TickerContent() {
  return (
    <>
      {ITEMS.map((label, i) => (
        <span key={i} className="flex items-center gap-3 shrink-0 px-6">
          <span className="text-sm font-normal uppercase tracking-widest text-neutral-300">
            {label}
          </span>
          <span className="text-accent">·</span>
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
