import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Inicia sesión — Ankla",
  description: "Entra a tu cuenta de Ankla: tu curso, tus hábitos y tu Radar de Vida.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
