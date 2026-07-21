"use client";

import { useEffect, useState } from "react";
import { AchievementCard, TIER_LABELS } from "@/components/AchievementCard";
import { PhotoSlot } from "@/components/PhotoSlot";
import { IconLock } from "@/components/icons";
import type { AchievementProgress } from "@/lib/achievements";

/**
 * The grid itself is the existing AchievementCard, just wrapped in a
 * button with the app's own lift-on-hover (already used elsewhere — no new
 * hover language invented). Click opens a detail view: bigger tilted card,
 * a real progress bar toward the next tier, and prev/next to browse every
 * logro without closing — the "gallery" feel from the reference, in
 * EJECUTA's own visual system.
 */
export function AchievementsGallery({ progress }: { progress: AchievementProgress[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? null : (i + delta + progress.length) % progress.length));

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {progress.map((p, i) => (
          <button
            key={p.achievement.id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="text-left lift-on-hover"
            aria-haspopup="dialog"
          >
            <AchievementCard progress={p} index={i} />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <AchievementDetail
          progress={progress[openIndex]}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      ) : null}
    </>
  );
}

function AchievementDetail({
  progress,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  progress: AchievementProgress;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const { achievement, earnedTier, currentValue, nextTier } = progress;
  const locked = earnedTier === 0;
  const activeTier = achievement.tiers.find((t) => t.tier === earnedTier) ?? null;
  const hue = (index * 47) % 360;
  const targetTier = nextTier ?? achievement.tiers[achievement.tiers.length - 1];
  const progressPct = Math.min(100, Math.round((currentValue / targetTier.threshold) * 100));

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={achievement.title}
      className="fixed inset-0 z-50 bg-ink flex items-center justify-center px-6 py-10 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="absolute inset-0 -z-10 opacity-[0.12] pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${achievement.color}, transparent 60%)`,
          filter: "blur(80px)",
        }}
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 text-neutral-500 hover:text-white text-sm uppercase tracking-widest"
      >
        Cerrar ✕
      </button>

      <div
        className="w-full max-w-3xl grid md:grid-cols-2 gap-10 items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="order-2 md:order-1 text-center md:text-left">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: achievement.color }}>
            {locked ? "Bloqueado" : TIER_LABELS[activeTier!.tier]}
          </p>
          <h2 className="text-3xl font-bold mb-2">{achievement.title}</h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-sm mx-auto md:mx-0">
            {achievement.narrative}
          </p>

          <div className="flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500 mb-1.5">
            <span>{nextTier ? `Hacia "${nextTier.name}"` : "Nivel máximo alcanzado"}</span>
            <span>
              {Math.min(currentValue, targetTier.threshold)} / {targetTier.threshold}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-line overflow-hidden mb-6">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${progressPct}%`, background: achievement.color }}
            />
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1.5 mb-8">
            {achievement.tiers.map((t) => (
              <span
                key={t.tier}
                className="w-2 h-2 rounded-full"
                style={{ background: t.tier <= earnedTier ? achievement.color : "var(--line, #262420)" }}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <button type="button" onClick={onPrev} className="btn-secondary">
              ← Anterior
            </button>
            <button type="button" onClick={onNext} className="btn-secondary">
              Siguiente →
            </button>
          </div>
        </div>

        <div className="order-1 md:order-2 flex justify-center">
          <div
            className="w-52 md:w-64 -rotate-3 shrink-0"
            style={{
              filter: locked ? "grayscale(1) brightness(0.55)" : `hue-rotate(${hue}deg)`,
              boxShadow: "0 30px 60px -15px rgba(0,0,0,0.6)",
            }}
          >
            <div className="relative aspect-square rounded-lg border border-line bg-surface overflow-hidden">
              <PhotoSlot shape="rounded" alt="" className="w-full h-full rounded-none" />
              {locked ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <IconLock className="w-9 h-9 text-white/70" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
