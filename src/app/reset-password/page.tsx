import { Suspense } from "react";
import type { Metadata } from "next";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Elige una contraseña nueva — Ankla",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div className="auth-shell">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
