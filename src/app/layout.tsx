import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { VersionBadge } from "@/components/VersionBadge";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "EJECUTA — Sistema de Ejecucion Sostenible",
  description:
    "Curso interactivo basado en el Principio de Pareto: identifica el 20% de acciones que generan el 80% de tu cambio.",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body>
        <Providers>{children}</Providers>
        <VersionBadge />
      </body>
    </html>
  );
}
