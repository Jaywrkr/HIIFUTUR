"use client";

import { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "@/lib/push-actions";

type Status = "unsupported" | "checking" | "denied" | "off" | "on" | "busy";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function PushNotificationToggle() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setStatus("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setStatus("denied");
      return;
    }
    navigator.serviceWorker.ready
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => setStatus(sub ? "on" : "off"))
      .catch(() => setStatus("off"));
  }, []);

  async function enable() {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!publicKey) {
      setStatus("unsupported");
      return;
    }
    setStatus("busy");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "off");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const result = await subscribeToPush(sub.toJSON());
      setStatus(result.ok ? "on" : "off");
    } catch {
      setStatus("off");
    }
  }

  async function disable() {
    setStatus("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await unsubscribeFromPush(sub.endpoint);
        await sub.unsubscribe();
      }
      setStatus("off");
    } catch {
      setStatus("on");
    }
  }

  if (status === "unsupported") {
    return (
      <p className="text-sm text-neutral-500">
        Tu navegador no soporta notificaciones push. En iPhone, agrega Ankla a tu pantalla de
        inicio primero.
      </p>
    );
  }

  if (status === "denied") {
    return (
      <p className="text-sm text-neutral-500">
        Bloqueaste las notificaciones para Ankla. Actívalas desde la configuración de tu
        navegador si quieres recibirlas.
      </p>
    );
  }

  if (status === "checking") {
    return <p className="text-sm text-neutral-500">Revisando...</p>;
  }

  if (status === "on") {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-accent">Activadas en este dispositivo.</p>
        <button type="button" onClick={disable} className="btn-secondary text-xs py-2 px-4">
          Desactivar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-neutral-400">Recibe un aviso — y márcalo hecho sin abrir la app.</p>
      <button
        type="button"
        onClick={enable}
        disabled={status === "busy"}
        className="btn-primary text-xs py-2 px-4 disabled:opacity-50"
      >
        {status === "busy" ? "..." : "Activar"}
      </button>
    </div>
  );
}
