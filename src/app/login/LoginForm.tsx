"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const justRegistered = params.get("registered") === "1";
  const justReset = params.get("reset") === "1";
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("Email o contrasena incorrectos.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="auth-card">
      <p className="kicker">EJECUTA</p>
      <h1 className="auth-title">Inicia sesion</h1>
      <p className="auth-sub">Vuelve al sistema. Hoy tambien cuenta.</p>

      {justRegistered ? (
        <p className="form-success">Cuenta creada. Inicia sesion para continuar.</p>
      ) : null}
      {justReset ? (
        <p className="form-success">Contrasena actualizada. Inicia sesion con la nueva.</p>
      ) : null}

      <form action={handleSubmit} className="auth-form">
        <label className="field-label" htmlFor="email">EMAIL</label>
        <input id="email" name="email" type="email" required className="field-input" placeholder="tu@email.com" />

        <div className="flex items-center justify-between mt-4 mb-1">
          <label className="field-label mt-0 mb-0" htmlFor="password">CONTRASENA</label>
          <Link href="/forgot-password" className="text-xs text-neutral-500 hover:text-accent transition-colors">
            Olvidaste tu contrasena?
          </Link>
        </div>
        <input id="password" name="password" type="password" required className="field-input" placeholder="Tu contrasena" />

        {error ? <p className="form-error">{error}</p> : null}

        <button type="submit" disabled={pending} className="btn-primary w-full mt-6">
          {pending ? "ENTRANDO..." : "ENTRAR"}
        </button>
      </form>

      <p className="auth-footer">
        No tienes cuenta? <Link href="/register" className="link-accent">Registrate</Link>
      </p>
    </div>
  );
}
