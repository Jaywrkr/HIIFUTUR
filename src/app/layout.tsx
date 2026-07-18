import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { VersionBadge } from "@/components/VersionBadge";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import { MetaPixel } from "@/components/MetaPixel";

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://hiifutur.vercel.app";
const TITLE = "EJECUTA — Sistema de Ejecución Sostenible";
const DESCRIPTION =
  "Curso interactivo basado en el Principio de Pareto: identifica el 20% de acciones que generan el 80% de tu cambio.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  // Only rendered once GOOGLE_SITE_VERIFICATION is set (from Search Console
  // -> Settings -> Ownership verification -> HTML tag) — no-op until then.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "EJECUTA",
    locale: "es",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={GeistMono.variable}>
      <body>
        <Providers>{children}</Providers>
        <VersionBadge />
        <RegisterServiceWorker />
        <MetaPixel />
      </body>
    </html>
  );
}
