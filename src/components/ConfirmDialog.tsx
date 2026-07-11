"use client";

/** Generic yes/no confirmation modal, styled like WelcomeTour's overlay. */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = "Revisar de nuevo",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-3xl border border-line bg-surface p-6 text-center">
        <h2 className="text-lg font-extrabold tracking-tight mb-2">{title}</h2>
        <p className="text-sm text-neutral-300 leading-relaxed mb-6">{body}</p>
        <div className="flex flex-col gap-3">
          <button type="button" onClick={onConfirm} className="btn-primary w-full">
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
