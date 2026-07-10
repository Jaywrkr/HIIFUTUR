"use client";

import { useEffect, useRef, useState } from "react";

type Status = "idle" | "playing" | "paused";

/**
 * Reads the module aloud with the browser's built-in speech synthesis
 * (Web Speech API) — no external service, works offline on most devices.
 * The text is queued paragraph by paragraph: long single utterances get
 * silently dropped by some engines.
 */
export function ModuleListenButton({ paragraphs }: { paragraphs: string[] }) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const queueIndex = useRef(0);
  const stopped = useRef(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  function pickSpanishVoice(): SpeechSynthesisVoice | null {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith("es-mx")) ??
      voices.find((v) => v.lang.toLowerCase().startsWith("es")) ??
      null
    );
  }

  function speakFrom(index: number) {
    if (stopped.current || index >= paragraphs.length) {
      setStatus("idle");
      queueIndex.current = 0;
      return;
    }
    queueIndex.current = index;
    const utterance = new SpeechSynthesisUtterance(paragraphs[index]);
    utterance.lang = "es-MX";
    const voice = pickSpanishVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 1;
    utterance.onend = () => speakFrom(index + 1);
    utterance.onerror = () => setStatus("idle");
    window.speechSynthesis.speak(utterance);
  }

  function handleClick() {
    const synth = window.speechSynthesis;
    if (status === "playing") {
      synth.pause();
      setStatus("paused");
    } else if (status === "paused") {
      synth.resume();
      setStatus("playing");
    } else {
      stopped.current = false;
      synth.cancel();
      setStatus("playing");
      speakFrom(0);
    }
  }

  function handleStop() {
    stopped.current = true;
    window.speechSynthesis.cancel();
    setStatus("idle");
    queueIndex.current = 0;
  }

  return (
    <div className="flex items-center gap-3 mb-8">
      <button type="button" onClick={handleClick} className="btn-secondary text-xs py-2 px-4">
        {status === "playing" ? "⏸ Pausar" : status === "paused" ? "▶ Continuar" : "🔊 Escuchar este módulo"}
      </button>
      {status !== "idle" ? (
        <button
          type="button"
          onClick={handleStop}
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          Detener
        </button>
      ) : null}
    </div>
  );
}
