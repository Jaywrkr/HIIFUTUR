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
    <div className="mb-6 rounded-lg border border-accent/40 bg-accent/10 p-4 flex items-center gap-3">
      <p className="text-sm text-neutral-200">
        Se desbloqueó tu siguiente hábito. Sostener el actual te trajo hasta aquí.
      </p>
    </div>
  );
}
