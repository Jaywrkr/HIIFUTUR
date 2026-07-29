import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "Ankla — Sistema de Ejecución Sostenible";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const heroPath = path.join(process.cwd(), "public", "hero-radar-ancla.png");
  const heroBuffer = await readFile(heroPath);
  const heroSrc = `data:image/png;base64,${heroBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#000000",
          fontFamily: "sans-serif",
        }}
      >
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={heroSrc}
            width={1200}
            height={630}
            alt=""
            style={{ position: "absolute", top: 0, left: 0, objectFit: "cover", opacity: 0.85 }}
          />
        }
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.92) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 48,
            left: 56,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid #333333",
              background: "rgba(10,10,10,0.75)",
              borderRadius: 999,
              padding: "9px 22px",
              marginBottom: 22,
              alignSelf: "flex-start",
            }}
          >
            <span style={{ color: "#FFFFFF", fontSize: 17, fontWeight: 700, letterSpacing: 3 }}>
              SISTEMA DE EJECUCIÓN SOSTENIBLE
            </span>
          </div>
          <div
            style={{
              display: "flex",
              color: "#F5F5F5",
              fontSize: 84,
              fontWeight: 800,
              letterSpacing: 1,
              lineHeight: 1,
            }}
          >
            Ankla
          </div>
          <div style={{ display: "flex", color: "#D4D4D4", fontSize: 30, marginTop: 14 }}>
            Un sistema, no una promesa.
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
