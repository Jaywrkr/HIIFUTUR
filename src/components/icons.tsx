/** Small hand-drawn line icon set — replaces emoji in the app chrome
 * (cuenta, dashboard, nav) with something that reads consistently across
 * light/dark and doesn't depend on the OS's emoji font. currentColor-based,
 * size via className (e.g. "w-5 h-5"). */

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function IconUser({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
    </svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  );
}

export function IconLock({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconFlame({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 3c1 3-3 4.5-3 8a3 3 0 0 0 6 0c0-1-.5-1.8-1-2.5.8.3 3 1.8 3 5.5a5 5 0 0 1-10 0C7 9.5 10 6.5 12 3Z" />
    </svg>
  );
}

export function IconSprout({ className }: IconProps) {
  return (
    <svg {...base} className={className} aria-hidden="true">
      <path d="M12 21V12" />
      <path d="M12 12C12 8 9 6 5 6c0 4 3 6 7 6Z" />
      <path d="M12 9C12 6 14.5 4.5 18 4.5c0 3.2-2.5 5.5-6 5.5Z" />
    </svg>
  );
}
