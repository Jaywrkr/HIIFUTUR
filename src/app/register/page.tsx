import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crea tu cuenta — Ankla",
  description: "Un sistema, no una promesa. Curso, hábitos y Radar de Vida en un solo lugar — empieza aquí.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <div className="auth-shell">
      <RegisterForm />
    </div>
  );
}
