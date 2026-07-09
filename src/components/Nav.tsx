"use client";

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

  return (
    <>
      <nav className="app-nav">
        <div className="app-nav-inner">
          <Link href="/dashboard" className="app-logo">
            EJECUTA
          </Link>
          <div className="app-nav-links">
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
        </div>
      </nav>
      <FeedbackWidget />
    </>
  );
}
