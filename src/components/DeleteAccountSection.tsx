"use client";

import { useState, useTransition } from "react";
import { signOut } from "next-auth/react";
import { deleteAccount } from "@/lib/account-actions";

export function DeleteAccountSection({ userEmail }: { userEmail: string }) {
  const [open, setOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount(confirmEmail);
      if (result.error) {
        setError(result.error);
      } else {
        signOut({ callbackUrl: "/" });
      }
    });
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors"
      >
        Eliminar mi cuenta
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-900/50 bg-red-950/10 p-5">
      <p className="font-bold mb-1">Eliminar tu cuenta es permanente.</p>
      <p className="muted mb-4">
        Se borran tus hábitos, tu historial, tus mediciones del Wheel of Life y tu progreso en los
        módulos. No hay forma de recuperarlo después.
      </p>
      <label className="field-label" htmlFor="confirm-email">
        Escribe tu email ({userEmail}) para confirmar
      </label>
      <input
        id="confirm-email"
        type="email"
        value={confirmEmail}
        onChange={(e) => setConfirmEmail(e.target.value)}
        className="field-input w-full"
        placeholder={userEmail}
      />
      {error ? <p className="form-error">{error}</p> : null}
      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending || confirmEmail.trim().toLowerCase() !== userEmail.toLowerCase()}
          className="bg-red-500 text-black font-bold uppercase tracking-widest text-sm py-2.5 px-5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {pending ? "Eliminando..." : "Si, eliminar mi cuenta"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setConfirmEmail("");
            setError(null);
          }}
          className="btn-secondary text-xs py-2.5 px-5"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
