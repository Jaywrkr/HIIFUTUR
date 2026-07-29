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
      fileName="ankla-radar-de-vida.png"
      shareText="Mi Radar de Vida en ANKLA."
      label="Compartir mi Radar de Vida"
    />
  );
}
