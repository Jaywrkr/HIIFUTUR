"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resetPassword, type ResetPasswordState } from "@/lib/password-reset-actions";

const initialState: ResetPasswordState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-6">
      {pending ? "GUARDANDO..." : "GUARDAR CONTRASENA"}
    </button>
  );
}

export function ResetPasswordForm() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [state, formAction] = useFormState(resetPassword, initialState);

  if (!token) {
    return (
      <div className="auth-card">
        <p className="kicker">EJECUTA</p>
        <h1 className="auth-title">Enlace invalido</h1>
        <p className="auth-sub">Este enlace no trae la informacion necesaria.</p>
        <p className="auth-footer">
          <Link href="/forgot-password" className="link-accent">Pedir un enlace nuevo</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <p className="kicker">EJECUTA</p>
      <h1 className="auth-title">Elige tu nueva contrasena</h1>
      <p className="auth-sub">Minimo 8 caracteres.</p>

      <form action={formAction} className="auth-form">
        <input type="hidden" name="token" value={token} />

        <label className="field-label" htmlFor="password">CONTRASENA NUEVA</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="field-input"
          placeholder="Minimo 8 caracteres"
        />

        {state.error ? <p className="form-error">{state.error}</p> : null}

        <SubmitButton />
      </form>

      <p className="auth-footer">
        <Link href="/login" className="link-accent">Volver a inicio de sesion</Link>
      </p>
    </div>
  );
}
