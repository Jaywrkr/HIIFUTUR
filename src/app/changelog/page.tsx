import Link from "next/link";
import { CHANGELOG } from "@/lib/changelog";

export const metadata = { title: "Changelog — EJECUTA" };

export default function ChangelogPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Link href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors">
        ← EJECUTA
      </Link>
      <p className="kicker mt-8">Changelog</p>
      <h1 className="text-3xl font-extrabold tracking-tight mb-2">Que ha cambiado</h1>
      <p className="muted mb-10">Cada version, en orden. Sin letra chica.</p>

      <div className="flex flex-col gap-10 mb-16">
        {CHANGELOG.map((entry) => (
          <div key={entry.version} className="border-b border-line pb-8 last:border-b-0">
            <div className="flex items-baseline gap-3 mb-3">
              <p className="font-bold text-accent">v{entry.version}</p>
              <p className="text-xs uppercase tracking-widest text-neutral-500">{entry.date}</p>
            </div>
            <ul className="flex flex-col gap-1.5">
              {entry.changes.map((c) => (
                <li key={c} className="text-sm text-neutral-300 flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">—</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
