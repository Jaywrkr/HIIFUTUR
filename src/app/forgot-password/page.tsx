"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { requestPasswordReset, type ForgotPasswordState } from "@/lib/password-reset-actions";

const initialState: ForgotPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-6">
      {pending ? "ENVIANDO..." : "ENVIAR ENLACE"}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState);

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="kicker">EJECUTA</p>
        <h1 className="auth-title">Recupera tu acceso</h1>
        <p className="auth-sub">Te mandamos un enlace para elegir una contraseña nueva.</p>

        {state.message ? (
          <p className="form-success">{state.message}</p>
        ) : (
          <form action={formAction} className="auth-form">
            <label className="field-label" htmlFor="email">EMAIL</label>
            <input id="email" name="email" type="email" required className="field-input" placeholder="tu@email.com" />

            <SubmitButton />
          </form>
        )}

        <p className="auth-footer">
          <Link href="/login" className="link-accent">Volver a inicio de sesion</Link>
        </p>
      </div>
    </div>
  );
}
