import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ankla — Sistema de Ejecución Sostenible";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid #262626",
            background: "#0A0A0A",
            borderRadius: 999,
            padding: "10px 26px",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 700, letterSpacing: 4 }}>
            SISTEMA DE EJECUCIÓN SOSTENIBLE
          </span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#F5F5F5",
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          Ankla
        </div>
        <div style={{ display: "flex", color: "#A3A3A3", fontSize: 28, marginTop: 20 }}>
          Un sistema, no una promesa.
        </div>
      </div>
    ),
    { ...size }
  );
}
