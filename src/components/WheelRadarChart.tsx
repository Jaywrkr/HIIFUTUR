"use client";

import { useState } from "react";
import { WHEEL_AREAS } from "@/lib/constants";

// Hand-rolled SVG radar chart. Recharts (+ its D3 deps) was shipping ~95kB
// of JS for a single, largely static polygon chart — nowhere close to
// worth it. This renders the exact same shape (grid rings, two overlaid
// score polygons, per-area tooltip, legend) in plain SVG with zero deps.

const SIZE = 400;
const CENTER = SIZE / 2;
const MAX_RADIUS = 120;
const LABEL_RADIUS = MAX_RADIUS + 26;
const RINGS = [2, 4, 6, 8, 10];

function pointFor(index: number, count: number, radius: number) {
  const angle = -Math.PI / 2 + index * ((2 * Math.PI) / count);
  return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
}

function polygonPoints(values: number[], count: number) {
  return values
    .map((v, i) => {
      const { x, y } = pointFor(i, count, (Math.max(0, Math.min(10, v)) / 10) * MAX_RADIUS);
      return `${x},${y}`;
    })
    .join(" ");
}

/** How an HTML label should sit relative to its anchor point on the ring,
 * so it reads outward from the chart instead of centered on the point. */
function labelLayout(index: number, count: number): {
  textAlign: "left" | "center" | "right";
  translateX: string;
  translateY: string;
} {
  const angle = -Math.PI / 2 + index * ((2 * Math.PI) / count);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const textAlign = cos > 0.3 ? "left" : cos < -0.3 ? "right" : "center";
  const translateX = cos > 0.3 ? "0%" : cos < -0.3 ? "-100%" : "-50%";
  const translateY = sin > 0.3 ? "0%" : sin < -0.3 ? "-100%" : "-50%";
  return { textAlign, translateX, translateY };
}

export function WheelRadarChart({
  current,
  previous,
}: {
  current: Record<string, number>;
  previous?: Record<string, number> | null;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const count = WHEEL_AREAS.length;

  const currentValues = WHEEL_AREAS.map((a) => current[a.id] ?? 0);
  const previousValues = previous ? WHEEL_AREAS.map((a) => previous[a.id] ?? 0) : null;

  const active = activeIndex !== null ? WHEEL_AREAS[activeIndex] : null;
  const activePoint = activeIndex !== null ? pointFor(activeIndex, count, MAX_RADIUS * 0.55) : null;

  return (
    <div className="relative w-full flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[420px]"
        style={{ overflow: "visible" }}
        role="img"
        aria-label="Wheel of Life"
      >
        {/* Grid rings */}
        {RINGS.map((level) => (
          <polygon
            key={level}
            points={polygonPoints(WHEEL_AREAS.map(() => level), count)}
            fill="none"
            stroke="#2B241C"
          />
        ))}
        {/* Spokes */}
        {WHEEL_AREAS.map((_, i) => {
          const { x, y } = pointFor(i, count, MAX_RADIUS);
          return <line key={i} x1={CENTER} y1={CENTER} x2={x} y2={y} stroke="#2B241C" />;
        })}

        {/* Previous measurement (muted, behind) */}
        {previousValues ? (
          <polygon
            points={polygonPoints(previousValues, count)}
            fill="#6b6153"
            fillOpacity={0.15}
            stroke="#6b6153"
            strokeWidth={1.5}
          />
        ) : null}

        {/* Current measurement (accent, on top) */}
        <polygon
          points={polygonPoints(currentValues, count)}
          fill="#E3C9A0"
          fillOpacity={0.3}
          stroke="#E3C9A0"
          strokeWidth={2}
        />

        {/* Tap/hover targets, one per area — labels themselves are plain
            HTML below, so long names wrap instead of being clipped by the
            SVG's own overflow box. */}
        {WHEEL_AREAS.map((area, i) => {
          const { x, y } = pointFor(i, count, MAX_RADIUS);
          return (
            <circle
              key={area.id}
              cx={x}
              cy={y}
              r={16}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex((prev) => (prev === i ? null : prev))}
              onClick={() => setActiveIndex((prev) => (prev === i ? null : i))}
            />
          );
        })}
      </svg>

      {WHEEL_AREAS.map((area, i) => {
        const { x, y } = pointFor(i, count, LABEL_RADIUS);
        const { textAlign, translateX, translateY } = labelLayout(i, count);
        return (
          <div
            key={area.id}
            className={`absolute text-[10px] uppercase leading-tight select-none pointer-events-none w-[84px] ${
              activeIndex === i ? "text-accent" : "text-neutral-400"
            }`}
            style={{
              left: `${(x / SIZE) * 100}%`,
              top: `${(y / SIZE) * 100}%`,
              transform: `translate(${translateX}, ${translateY})`,
              textAlign,
            }}
          >
            {area.label}
          </div>
        );
      })}

      {active && activePoint ? (
        <div
          className="absolute rounded-xl border border-line bg-surface px-4 py-3 shadow-lg pointer-events-none"
          style={{
            left: `${(activePoint.x / SIZE) * 100}%`,
            top: `${(activePoint.y / SIZE) * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <p className="text-xs uppercase tracking-widest text-accent mb-1">{active.label}</p>
          <p className="text-sm">
            <span className="text-neutral-400">Actual: </span>
            <span className="font-bold">{current[active.id] ?? 0}/10</span>
          </p>
          {previous ? (
            <p className="text-sm">
              <span className="text-neutral-400">Mes anterior: </span>
              <span className="font-bold">{previous[active.id] ?? 0}/10</span>
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center gap-5 mt-4 text-xs uppercase tracking-wide">
        <span className="flex items-center gap-1.5 text-neutral-300">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#E3C9A0" }} />
          Actual
        </span>
        {previous ? (
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "#6b6153" }} />
            Mes anterior
          </span>
        ) : null}
      </div>
    </div>
  );
}
