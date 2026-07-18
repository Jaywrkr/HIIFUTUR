"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const links = [
  { href: "/dashboard", label: "HOY" },
  { href: "/modules", label: "MÓDULOS" },
  { href: "/habits", label: "HÁBITOS" },
  { href: "/wheel", label: "WHEEL OF LIFE" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/cuenta", label: "CUENTA" },
];

// The 4 highest-frequency destinations get their own tab; everything else
// (Leaderboard, Cuenta, Salir) lives behind "Más" — 5 tabs is the practical
// ceiling for a bottom bar before labels start crowding each other.
const TAB_ITEMS = [
  { href: "/dashboard", label: "Hoy" },
  { href: "/modules", label: "Módulos" },
  { href: "/habits", label: "Hábitos" },
  { href: "/wheel", label: "Wheel" },
];

const MORE_ITEMS = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/cuenta", label: "Cuenta" },
];

export function Nav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link href="/dashboard" className="app-logo">
            EJECUTA
          </Link>

          {/* Desktop: inline links, all of them */}
          <div className="hidden md:flex items-center gap-5 text-xs uppercase tracking-widest font-bold text-neutral-400">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className={`app-nav-link ${pathname.startsWith(l.href) ? "app-nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="app-nav-link">
              SALIR
            </button>
          </div>
        </div>
      </nav>
      <FeedbackWidget />

      {/* Mobile: fixed bottom tab bar replaces the old hamburger menu — one
          tap to the 4 screens people open daily, instead of opening a menu
          every time. */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-20 border-t border-line bg-ink"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5 h-16">
          {TAB_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMoreOpen(false)}
                className={`flex flex-col items-center justify-center text-[11px] uppercase tracking-wide font-bold ${
                  active ? "text-accent" : "text-neutral-500"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            aria-label={moreOpen ? "Cerrar más opciones" : "Más opciones"}
            aria-expanded={moreOpen}
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex flex-col items-center justify-center gap-1 text-[10px] uppercase tracking-wide ${
              moreOpen || pathname.startsWith("/leaderboard") || pathname.startsWith("/cuenta")
                ? "text-accent"
                : "text-neutral-500"
            }`}
          >
            <span className="text-lg leading-none" aria-hidden="true">
              ⋯
            </span>
            Más
          </button>
        </div>
      </nav>

      {/* "Más" panel: floats just above the tab bar */}
      {moreOpen ? (
        <div
          className="md:hidden fixed z-30 inset-x-4 rounded-2xl border border-line bg-surface shadow-2xl overflow-hidden"
          style={{ bottom: "calc(8.5rem + env(safe-area-inset-bottom))" }}
        >
          {MORE_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMoreOpen(false)}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className={`block px-5 py-3 text-xs uppercase tracking-widest font-bold border-b border-line/50 ${
                pathname.startsWith(item.href) ? "text-accent" : "text-neutral-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="block w-full px-5 py-3 text-xs uppercase tracking-widest font-bold text-neutral-300 text-left"
          >
            Salir
          </button>
        </div>
      ) : null}
    </>
  );
}
