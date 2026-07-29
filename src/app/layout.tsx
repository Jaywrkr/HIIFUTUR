import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { VersionBadge } from "@/components/VersionBadge";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import { MetaPixel } from "@/components/MetaPixel";

const geistMono = localFont({
  src: [
    { path: "../fonts/GeistMono-Thin.ttf", weight: "100", style: "normal" },
    { path: "../fonts/GeistMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../fonts/GeistMono-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../fonts/GeistMono-Bold.ttf", weight: "700", style: "normal" },
    { path: "../fonts/GeistMono-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-geist-mono",
  fallback: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    "monospace",
  ],
});

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://hiifutur.vercel.app";
const AUTHOR_NAME = "Jay Jaramillo";
const AUTHOR_HANDLE = "@jaywrkr";
const AUTHOR_SUFFIX = `${AUTHOR_NAME} (${AUTHOR_HANDLE})`;
const TITLE = `ANKLA — Sistema de Ejecución Sostenible · ${AUTHOR_SUFFIX}`;
const DESCRIPTION = `ANKLA es un sistema guiado de ejecución sostenible creado por ${AUTHOR_SUFFIX}: aprendizaje, hábitos y Radar de Vida para sostener cambios pequeños sin culpa.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${AUTHOR_SUFFIX}`,
  },
  description: DESCRIPTION,
  authors: [{ name: AUTHOR_NAME, url: "https://instagram.com/jaywrkr" }],
  manifest: "/manifest.webmanifest",
  alternates: { canonical: "/" },
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
    siteName: "ANKLA",
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
    <html lang="es" className={geistMono.variable}>
      <head>
        {/* Reads display preferences before first paint, so compact mode and
            film grain never flash back to their default state on load. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(localStorage.getItem("ejecuta_density")==="compact"){document.documentElement.setAttribute("data-density","compact");}if(localStorage.getItem("ejecuta_grain")==="on"){document.documentElement.setAttribute("data-grain","on");}}catch(e){}',
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <VersionBadge />
        <RegisterServiceWorker />
        <MetaPixel />
      </body>
    </html>
  );
}
