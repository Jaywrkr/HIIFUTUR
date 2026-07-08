"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { submitFeedback, type FeedbackState } from "@/lib/feedback-actions";

const initialState: FeedbackState = {};

function SendButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary text-xs py-2.5 px-5">
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [state, formAction] = useFormState(submitFeedback, initialState);

  useEffect(() => {
    if (state.ok) {
      const t = setTimeout(() => setOpen(false), 1800);
      return () => clearTimeout(t);
    }
  }, [state.ok]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-line bg-surface p-4 shadow-2xl">
          {state.ok ? (
            <p className="text-sm text-accent">Gracias. Lo leemos de verdad.</p>
          ) : (
            <form action={formAction} className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-widest text-accent">Feedback</p>
              <p className="muted">
                Un bug, algo confuso, una idea. Nos llega directo, no a un buzon que nadie revisa.
              </p>
              <input type="hidden" name="pageUrl" value={pathname} />
              <textarea
                name="message"
                required
                minLength={3}
                maxLength={2000}
                rows={4}
                className="field-input w-full resize-none"
                placeholder="Cuentame que pasa..."
              />
              {state.error ? <p className="form-error mt-0">{state.error}</p> : null}
              <div className="flex gap-3">
                <SendButton />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn-secondary text-xs py-2.5 px-5"
                >
                  Cerrar
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="btn-secondary text-xs py-2.5 px-4 shadow-2xl bg-surface"
        >
          💬 Feedback
        </button>
      )}
    </div>
  );
}
