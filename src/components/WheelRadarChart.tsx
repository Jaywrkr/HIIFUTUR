"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { WHEEL_AREAS } from "@/lib/constants";

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
      <RadarChart data={data} outerRadius="70%">
        <PolarGrid stroke="#2B241C" />
        <PolarAngleAxis dataKey="area" tick={{ fill: "#a89a85", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: "#6b6153", fontSize: 10 }} />
        {previous ? (
          <Radar name="Mes anterior" dataKey="anterior" stroke="#6b6153" fill="#6b6153" fillOpacity={0.15} />
        ) : null}
        <Radar name="Actual" dataKey="actual" stroke="#E3C9A0" fill="#E3C9A0" fillOpacity={0.3} />
        <Legend wrapperStyle={{ fontSize: 11, textTransform: "uppercase" }} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
