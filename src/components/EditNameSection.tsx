"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { updateName, type UpdateNameState } from "@/lib/account-actions";

const initialState: UpdateNameState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary text-xs py-2 px-4">
      {pending ? "Guardando..." : "Guardar"}
    </button>
  );
}

export function EditNameSection({ initialName }: { initialName: string }) {
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(initialName);
  const [state, formAction] = useFormState(updateName, initialState);
  const pendingValue = useRef(initialName);

  useEffect(() => {
    if (state.ok) {
      setDisplayName(pendingValue.current);
      setEditing(false);
    }
  }, [state]);

  function handleSubmit(formData: FormData) {
    pendingValue.current = String(formData.get("name") ?? "").trim();
    formAction(formData);
  }

  if (editing) {
    return (
      <form action={handleSubmit} className="flex items-center gap-3">
        <input
          name="name"
          type="text"
          required
          defaultValue={displayName}
          className="field-input"
          autoFocus
        />
        <SaveButton />
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="btn-secondary text-xs py-2 px-4"
        >
          Cancelar
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="font-bold">{displayName || "—"}</p>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
      >
        Editar
      </button>
      {state.error ? <p className="form-error mt-0">{state.error}</p> : null}
    </div>
  );
}
