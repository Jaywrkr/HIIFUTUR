"use client";

import { useEffect, useState } from "react";

/** Shown once per unlock event (keyed by the unlock date) so it doesn't
 * nag every time the page is visited after the habit is available. */
export function UnlockBanner({ unlockKey }: { unlockKey: string }) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const storageKey = `ejecuta:unlock-seen:${unlockKey}`;
    if (!localStorage.getItem(storageKey)) {
      setDismissed(false);
      localStorage.setItem(storageKey, "1");
    }
  }, [unlockKey]);

  if (dismissed) return null;

  return (
    <div className="mb-6 rounded-2xl border border-accent/40 bg-accent/10 p-4 flex items-center gap-3">
      <span className="text-2xl leading-none">🔓</span>
      <p className="text-sm text-neutral-200">
        Se desbloqueo tu siguiente habito. Sostener el actual te trajo hasta aqui.
      </p>
    </div>
  );
}
