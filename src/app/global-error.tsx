"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "16px",
            padding: "24px",
            textAlign: "center",
            background: "#000000",
            color: "#F5F5F5",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
          }}
        >
          <p
            style={{
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            EJECUTA
          </p>
          <h1 style={{ fontSize: "22px", margin: 0 }}>Algo se rompio de nuestro lado.</h1>
          <p style={{ color: "#A3A3A3", fontSize: "14px", maxWidth: "320px" }}>
            Ya nos enteramos. Intenta de nuevo en un momento.
          </p>
          <button
            onClick={reset}
            style={{
              background: "#FFFFFF",
              color: "#000",
              fontWeight: 700,
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "12px 24px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}
