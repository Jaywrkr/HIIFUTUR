import type { Metadata } from "next";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Recupera tu acceso — Ankla",
  description: "Te mandamos un enlace para elegir una contraseña nueva.",
  alternates: { canonical: "/forgot-password" },
};

export default function ForgotPasswordPage() {
  return (
    <div className="auth-shell">
      <ForgotPasswordForm />
    </div>
  );
}
