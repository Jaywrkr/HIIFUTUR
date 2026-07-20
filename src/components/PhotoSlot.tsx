/**
 * A swappable photo slot. Today it renders a self-contained pastel gradient
 * placeholder (no external asset, no photography exists in the app yet); the
 * moment there's a real image, pass `src` and it renders that instead — the
 * layout, shape and sizing stay identical. This is the single place every
 * "a photo goes here" spot in the app should route through, so swapping in
 * real photos later is one prop, not a redesign.
 *
 * The placeholder palette echoes the reference image the owner shared
 * (peach / coral / soft green flowing over a cream ground) so an empty slot
 * already reads as "editorial photo", matching the Open-style direction.
 */

type PhotoSlotProps = {
  /** When set, a real photo is shown instead of the placeholder. */
  src?: string | null;
  alt?: string;
  /** Circle for avatars, rounded rectangle for banners/thumbnails. */
  shape?: "circle" | "rounded";
  className?: string;
};

// A fixed placeholder so it doesn't shimmer/reshuffle between renders. Layered
// radial blobs + a faint diagonal grain, all inline so nothing leaves the page.
const PLACEHOLDER_BG = [
  "radial-gradient(120% 90% at 18% 22%, rgba(240,150,120,0.85), transparent 55%)",
  "radial-gradient(110% 80% at 82% 30%, rgba(150,205,120,0.8), transparent 55%)",
  "radial-gradient(120% 100% at 60% 80%, rgba(235,140,150,0.7), transparent 55%)",
  "radial-gradient(90% 80% at 30% 75%, rgba(120,200,190,0.55), transparent 55%)",
  "linear-gradient(135deg, #f3ece6, #efe7e2)",
].join(", ");

export function PhotoSlot({ src, alt = "", shape = "rounded", className = "" }: PhotoSlotProps) {
  const radius = shape === "circle" ? "rounded-full" : "rounded-lg";

  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={`${radius} object-cover ${className}`} />;
  }

  return (
    <div
      role="img"
      aria-label={alt || "Espacio para foto"}
      className={`${radius} overflow-hidden relative ${className}`}
      style={{ background: PLACEHOLDER_BG }}
    >
      {/* Fine grain so the flat gradient reads as a rendered image, not a UI fill. */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(0,0,0,0.6) 0 1px, transparent 1px 3px)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
