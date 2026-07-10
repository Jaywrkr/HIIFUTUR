"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/lib/auth-actions";

const initialState: RegisterState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full mt-6">
      {pending ? "CREANDO CUENTA..." : "CREAR CUENTA"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerUser, initialState);

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="kicker">EJECUTA</p>
        <h1 className="auth-title">Crea tu cuenta</h1>
        <p className="auth-sub">Un sistema, no una promesa. Empieza aquí.</p>

        <form action={formAction} className="auth-form">
          <label className="field-label" htmlFor="name">NOMBRE</label>
          <input id="name" name="name" type="text" required className="field-input" placeholder="Tu nombre" />

          <label className="field-label" htmlFor="email">EMAIL</label>
          <input id="email" name="email" type="email" required className="field-input" placeholder="tu@email.com" />

          <label className="field-label" htmlFor="password">CONTRASEÑA</label>
          <input id="password" name="password" type="password" required minLength={8} className="field-input" placeholder="Mínimo 8 caracteres" />

          {state.error ? <p className="form-error">{state.error}</p> : null}

          <SubmitButton />
        </form>

        <p className="text-xs text-neutral-500 text-center mt-4">
          Al crear una cuenta aceptas los{" "}
          <Link href="/términos" className="link-accent">Términos</Link> y la{" "}
          <Link href="/privacidad" className="link-accent">Privacidad</Link>.
        </p>

        <p className="auth-footer">
          Ya tienes cuenta? <Link href="/login" className="link-accent">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
