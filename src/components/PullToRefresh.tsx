"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getMantraOfTheDay } from "@/lib/mantras";

const THRESHOLD = 70;
const MAX_PULL = 110;

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef<number | null>(null);
  const mantra = useRef(getMantraOfTheDay());

  function onTouchStart(e: React.TouchEvent) {
    if (window.scrollY > 0 || refreshing) {
      startY.current = null;
      return;
    }
    startY.current = e.touches[0].clientY;
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startY.current === null) return;
    const delta = e.touches[0].clientY - startY.current;
    if (delta <= 0) {
      setPull(0);
      return;
    }
    // Only take over the gesture once it's clearly a downward pull at the
    // top of the page — otherwise this would fight normal scrolling.
    setPull(Math.min(delta * 0.5, MAX_PULL));
  }

  function onTouchEnd() {
    if (pull >= THRESHOLD) {
      setRefreshing(true);
      setPull(THRESHOLD);
      router.refresh();
      setTimeout(() => {
        setRefreshing(false);
        setPull(0);
        mantra.current = getMantraOfTheDay();
      }, 900);
    } else {
      setPull(0);
    }
    startY.current = null;
  }

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex items-center justify-center overflow-hidden text-center px-6"
        style={{
          height: pull,
          opacity: Math.min(pull / THRESHOLD, 1),
          transition: pull === 0 || refreshing ? "height 200ms ease-out" : "none",
        }}
      >
        <p className="text-xs text-neutral-400 italic">
          {refreshing ? "Actualizando..." : pull >= THRESHOLD ? "Suelta" : `"${mantra.current}"`}
        </p>
      </div>
      {children}
    </div>
  );
}
