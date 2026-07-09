import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EJECUTA — Sistema de Ejecucion Sostenible";
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
          background: "#0F0C09",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid #2B241C",
            background: "#17130F",
            borderRadius: 999,
            padding: "10px 26px",
            marginBottom: 36,
          }}
        >
          <span style={{ color: "#E3C9A0", fontSize: 20, fontWeight: 700, letterSpacing: 4 }}>
            SISTEMA DE EJECUCION SOSTENIBLE
          </span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#F2ECE2",
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: 2,
          }}
        >
          EJECUTA
        </div>
        <div style={{ display: "flex", color: "#8a8072", fontSize: 28, marginTop: 20 }}>
          Un sistema, no una promesa.
        </div>
      </div>
    ),
    { ...size }
  );
}
