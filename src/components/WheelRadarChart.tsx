"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { TooltipProps } from "recharts";
import { WHEEL_AREAS } from "@/lib/constants";

function AreaTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-line bg-surface px-4 py-3 shadow-lg">
      <p className="text-xs uppercase tracking-widest text-accent mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm">
          <span className="text-neutral-400">{entry.name}: </span>
          <span className="font-bold">{entry.value}/10</span>
        </p>
      ))}
    </div>
  );
}

export function WheelRadarChart({
  current,
  previous,
}: {
  current: Record<string, number>;
  previous?: Record<string, number> | null;
}) {
  const data = WHEEL_AREAS.map((area) => ({
    area: area.label,
    actual: current[area.id] ?? 0,
    anterior: previous ? previous[area.id] ?? 0 : undefined,
  }));

  return (
    <ResponsiveContainer width="100%" height={360}>
      {/* trigger="hover" also fires on tap in touch browsers, so mobile
          gets the value with a click without any extra handling. */}
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="#2B241C" />
        <PolarAngleAxis dataKey="area" tick={{ fill: "#a89a85", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#6b6153", fontSize: 10 }} />
        <Tooltip content={<AreaTooltip />} cursor={{ stroke: "#E3C9A0", strokeOpacity: 0.4 }} />
        {previous ? (
          <Radar
            name="Mes anterior"
            dataKey="anterior"
            stroke="#6b6153"
            fill="#6b6153"
            fillOpacity={0.15}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        ) : null}
        <Radar
          name="Actual"
          dataKey="actual"
          stroke="#E3C9A0"
          fill="#E3C9A0"
          fillOpacity={0.3}
          isAnimationActive
          animationDuration={900}
          animationBegin={previous ? 150 : 0}
          animationEasing="ease-out"
        />
        <Legend wrapperStyle={{ fontSize: 11, textTransform: "uppercase" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
