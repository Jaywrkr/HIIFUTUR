import { TESTIMONIALS } from "@/lib/testimonials";

/** Renders nothing while TESTIMONIALS is empty — add real ones to
 * src/lib/testimonials.ts and this section turns on with zero other
 * changes needed. */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <p className="kicker mx-auto w-fit">Gente que ya lo está sosteniendo</p>
      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="card">
            <p className="text-sm text-neutral-300 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <p className="text-sm font-bold mt-4">{t.name}</p>
            {t.result ? <p className="muted text-xs mt-1">{t.result}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
