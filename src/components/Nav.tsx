"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { FeedbackWidget } from "@/components/FeedbackWidget";

const links = [
  { href: "/dashboard", label: "HOY" },
  { href: "/modules", label: "MODULOS" },
  { href: "/wheel", label: "WHEEL OF LIFE" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/cuenta", label: "CUENTA" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link href="/dashboard" className="app-logo">
            EJECUTA
          </Link>

          {/* Desktop: inline links */}
          <div className="hidden md:flex items-center gap-5 text-xs uppercase tracking-widest text-neutral-500">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`app-nav-link ${pathname.startsWith(l.href) ? "app-nav-link-active" : ""}`}
              >
                {l.label}
              </Link>
            ))}
            <button onClick={() => signOut({ callbackUrl: "/login" })} className="app-nav-link">
              SALIR
            </button>
          </div>

          {/* Mobile: hamburger */}
          <button
            type="button"
            aria-label={open ? "Cerrar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 -mr-2 gap-[5px]"
          >
            <span
              className={`block w-5 h-[2px] bg-white transition-transform duration-200 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-white transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-[2px] bg-white transition-transform duration-200 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile menu panel */}
        {open ? (
          <div className="md:hidden border-t border-line bg-ink">
            <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`py-3 text-xs uppercase tracking-widest border-b border-line/50 last:border-0 ${
                    pathname.startsWith(l.href) ? "text-accent" : "text-neutral-400"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="py-3 text-xs uppercase tracking-widest text-neutral-400 text-left"
              >
                SALIR
              </button>
            </div>
          </div>
        ) : null}
      </nav>
      <FeedbackWidget />
    </>
  );
}
