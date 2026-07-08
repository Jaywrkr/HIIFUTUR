"use client";

import { ShareImageButton } from "@/components/ShareImageButton";
import { drawWheelShareCard } from "@/lib/share-card";

export function ShareWheelButton({
  areaScores,
  areaLabels,
}: {
  areaScores: Record<string, number>;
  areaLabels: { id: string; label: string }[];
}) {
  return (
    <ShareImageButton
      draw={(canvas) => drawWheelShareCard(canvas, { areaScores, areaLabels })}
      fileName="ejecuta-wheel-of-life.png"
      shareText="Mi Wheel of Life en EJECUTA."
      label="Compartir mi Wheel of Life"
    />
  );
}
