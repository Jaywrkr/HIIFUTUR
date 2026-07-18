const DAYS = [
  { label: "LUN", n: "6" },
  { label: "MAR", n: "7" },
  { label: "MIE", n: "8" },
  { label: "JUE", n: "9" },
  { label: "VIE", n: "10" },
];

/** Illustrative preview of the app UI, not real user data. */
export function WebAppMockup() {
  return (
    <div className="hidden md:block">
      <div className="rounded-3xl border border-line bg-surface overflow-hidden shadow-2xl">
        <div className="flex items-center gap-4 px-5 py-3 border-b border-line">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
          </div>
          <div className="flex-1 bg-ink border border-line rounded-full px-4 py-1.5 text-xs text-neutral-500">
            ejecuta.app
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-thin tracking-[0.3em] text-white">EJECUTA</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-ink border border-line rounded-full px-3 py-1">
                4 días
              </span>
              <span className="text-xs bg-ink border border-line rounded-full px-3 py-1">
                7/10
              </span>
            </div>
          </div>

          <p className="muted mb-1">Bienvenido de vuelta</p>
          <p className="font-thin text-lg mb-6">Jay</p>

          <div className="flex gap-2 mb-6">
            {DAYS.map((d, i) => (
              <div
                key={d.label}
                className={`flex-1 text-center rounded-xl py-2 text-xs ${
                  i === 2
                    ? "bg-accent text-black font-normal"
                    : "bg-ink border border-line text-neutral-500"
                }`}
              >
                <p className="tracking-widest">{d.label}</p>
                <p className="font-normal mt-0.5">{d.n}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-line bg-ink p-5">
            <p className="kicker mb-3">Hoy</p>
            <p className="font-normal mb-1">5 sentadillas</p>
            <p className="muted mb-4">Manten presionado para marcar como hecho.</p>
            <div className="h-2 rounded-full bg-line overflow-hidden">
              <div className="h-full bg-accent" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
