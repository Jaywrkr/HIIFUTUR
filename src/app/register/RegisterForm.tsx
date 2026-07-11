"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, type RegisterState } from "@/lib/auth-actions";

const initialState: RegisterState = {};

function SubmitButton({ signingIn }: { signingIn: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || signingIn} className="btn-primary w-full mt-6">
      {pending ? "CREANDO CUENTA..." : signingIn ? "ENTRANDO..." : "CREAR CUENTA"}
    </button>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(registerUser, initialState);
  const [signingIn, setSigningIn] = useState(false);
  const credentialsRef = useRef({ email: "", password: "" });

  // The account was just created — sign in with the same credentials right
  // away instead of sending the person to /login to retype what they just
  // typed. Falls back to the old redirect-to-login flow if that somehow fails.
  useEffect(() => {
    if (!state.ok) return;
    setSigningIn(true);
    signIn("credentials", {
      email: credentialsRef.current.email,
      password: credentialsRef.current.password,
      redirect: false,
    }).then((result) => {
      if (result?.error) {
        router.push("/login?registered=1");
        return;
      }
      router.push("/onboarding");
      router.refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.ok]);

  return (
    <div className="auth-card">
      <p className="kicker">EJECUTA</p>
      <h1 className="auth-title">Crea tu cuenta</h1>
      <p className="auth-sub">Un sistema, no una promesa. Empieza aquí.</p>

      <form
        action={formAction}
        onSubmit={(e) => {
          const data = new FormData(e.currentTarget);
          credentialsRef.current = {
            email: String(data.get("email") ?? ""),
            password: String(data.get("password") ?? ""),
          };
        }}
        className="auth-form"
      >
        <label className="field-label" htmlFor="name">NOMBRE</label>
        <input id="name" name="name" type="text" required className="field-input" placeholder="Tu nombre" />

        <label className="field-label" htmlFor="email">EMAIL</label>
        <input id="email" name="email" type="email" required className="field-input" placeholder="tu@email.com" />

        <label className="field-label" htmlFor="password">CONTRASEÑA</label>
        <input id="password" name="password" type="password" required minLength={8} className="field-input" placeholder="Mínimo 8 caracteres" />

        {state.error ? <p className="form-error">{state.error}</p> : null}

        <SubmitButton signingIn={signingIn} />
      </form>

      <p className="text-xs text-neutral-500 text-center mt-4">
        Al crear una cuenta aceptas los{" "}
        <Link href="/terminos" className="link-accent">Términos</Link> y la{" "}
        <Link href="/privacidad" className="link-accent">Privacidad</Link>.
      </p>

      <p className="auth-footer">
        ¿Ya tienes cuenta? <Link href="/login" className="link-accent">Inicia sesión</Link>
      </p>
    </div>
  );
}
