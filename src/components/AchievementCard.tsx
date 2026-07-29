import { PhotoSlot } from "@/components/PhotoSlot";
import { IconLock } from "@/components/icons";
import type { AchievementProgress } from "@/lib/achievements";

export const TIER_LABELS: Record<number, string> = { 1: "Común", 2: "Raro", 3: "Legendario" };

/**
 * The card object from the reference (art up top, title, flavor line, a
 * rarity badge + reward in the footer, tier pips below) rebuilt entirely in
 * ANKLA's own system: Geist Mono instead of serif, rounded-lg/borders
 * instead of glossy rounded-3xl panels, the earthy accent per-achievement
 * instead of full-color art, and the same grayscale-lock treatment already
 * used for locked modules — no new visual language invented, just this
 * structure applied to what already exists.
 */
export function AchievementCard({ progress, index }: { progress: AchievementProgress; index: number }) {
  const { achievement, earnedTier, nextTier } = progress;
  const locked = earnedTier === 0;
  const activeTier = achievement.tiers.find((t) => t.tier === earnedTier) ?? achievement.tiers[0];
  const hue = (index * 47) % 360;

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-lg border border-line bg-surface overflow-hidden">
        <div
          className="relative aspect-square"
          style={{ filter: locked ? "grayscale(1) brightness(0.55)" : `hue-rotate(${hue}deg)` }}
        >
          <PhotoSlot shape="rounded" alt="" className="w-full h-full rounded-none" />
          {locked ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <IconLock className="w-7 h-7 text-white/70" />
            </div>
          ) : null}
        </div>
        <div className="p-4">
          <p className="font-bold text-base leading-tight">{achievement.title}</p>
          <p className="text-xs text-neutral-500 mt-1 leading-relaxed compact-hide">
            {locked ? achievement.narrative : `"${activeTier.name}" — ${activeTier.requirement}`}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-line">
            <span
              className={`text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border ${
                locked ? "text-neutral-500 border-line" : ""
              }`}
              style={locked ? undefined : { color: achievement.color, borderColor: achievement.color }}
            >
              {locked ? "Bloqueado" : TIER_LABELS[activeTier.tier]}
            </span>
            <span className="text-[11px] text-neutral-400">
              {locked ? achievement.tiers[0].requirement : `+${activeTier.points} puntos`}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 compact-hide">
        {achievement.tiers.map((t) => (
          <span
            key={t.tier}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: t.tier <= earnedTier ? achievement.color : "var(--line, #262420)" }}
            aria-hidden="true"
          />
        ))}
      </div>
      {nextTier && !locked ? (
        <p className="text-[10px] text-neutral-500 text-center compact-hide">
          Siguiente: {nextTier.requirement}
        </p>
      ) : null}
    </div>
  );
}
