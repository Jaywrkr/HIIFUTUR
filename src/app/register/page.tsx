import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Crea tu cuenta — EJECUTA",
  description: "Un sistema, no una promesa. Curso, hábitos y Wheel of Life en un solo lugar — empieza aquí.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <div className="auth-shell">
      <RegisterForm />
    </div>
  );
}
