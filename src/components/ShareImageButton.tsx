"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";

export function ShareImageButton({
  draw,
  fileName,
  shareText,
  label = "Compartir",
}: {
  draw: (canvas: HTMLCanvasElement) => void;
  fileName: string;
  shareText: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  async function handleClick() {
    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      draw(canvas);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) return;

      const file = new File([blob], fileName, { type: "image/png" });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], text: shareText }).catch(() => {
          // User cancelled the native share sheet — not an error.
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      toast("Imagen descargada.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="btn-secondary text-xs py-2 px-4 disabled:opacity-40"
    >
      {busy ? "Generando..." : label}
    </button>
  );
}
