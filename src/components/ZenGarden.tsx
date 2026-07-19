"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number; t: number };
type Stroke = Point[];

/** Small stones scattered on the sand — count and position derived from the
 * user's own habit count, so the garden reflects what they're actually
 * tending, without turning it into another number to optimize. */
function makeStones(habitCount: number, width: number, height: number) {
  const count = Math.min(Math.max(habitCount, 1), 5);
  const stones: { x: number; y: number; r: number }[] = [];
  // Deterministic pseudo-random spread (no Math.random) so layout doesn't
  // jump on re-render.
  for (let i = 0; i < count; i++) {
    const seed = (i * 137.5) % 360;
    const rad = (seed * Math.PI) / 180;
    const cx = width / 2 + Math.cos(rad) * width * 0.28;
    const cy = height / 2 + Math.sin(rad) * height * 0.22;
    stones.push({ x: cx, y: cy, r: 10 + (i % 3) * 4 });
  }
  return stones;
}

const TRAIL_LIFETIME_MS = 4000;
const STROKE_WIDTH = 14;

export function ZenGarden({ habitCount, onClose }: { habitCount: number; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
  const stonesRef = useRef<{ x: number; y: number; r: number }[]>([]);
  const reducedMotionRef = useRef(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;
    const ctx: CanvasRenderingContext2D = ctx2d;

    let raf = 0;

    function resize() {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stonesRef.current = makeStones(habitCount, width, height);
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas) return;
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);

      // Raked base lines — the "sand" texture.
      ctx.strokeStyle = "rgba(255,255,255,0.045)";
      ctx.lineWidth = 1;
      for (let y = 10; y < height; y += 9) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Stones.
      for (const s of stonesRef.current) {
        const grad = ctx.createRadialGradient(s.x - s.r * 0.3, s.y - s.r * 0.3, 1, s.x, s.y, s.r);
        grad.addColorStop(0, "rgba(255,255,255,0.35)");
        grad.addColorStop(1, "rgba(255,255,255,0.08)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(s.x, s.y, s.r, s.r * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Raked grooves from user strokes. With reduced motion, grooves stay
      // put (no auto-fading animation) until "alisar la arena" is pressed.
      const now = performance.now();
      if (!reducedMotionRef.current) {
        strokesRef.current = strokesRef.current.filter(
          (stroke) => now - stroke[stroke.length - 1].t < TRAIL_LIFETIME_MS
        );
      }

      for (const stroke of strokesRef.current) {
        for (let i = 1; i < stroke.length; i++) {
          const p0 = stroke[i - 1];
          const p1 = stroke[i];
          const age = now - p1.t;
          const life = reducedMotionRef.current ? 1 : Math.max(0, 1 - age / TRAIL_LIFETIME_MS);
          if (life <= 0) continue;
          ctx.strokeStyle = `rgba(245,245,245,${0.22 * life})`;
          ctx.lineWidth = STROKE_WIDTH;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(0,0,0,${0.18 * life})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y - 3);
          ctx.lineTo(p1.x, p1.y - 3);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    function toLocal(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top, t: performance.now() };
    }

    function onPointerDown(e: PointerEvent) {
      drawingRef.current = true;
      strokesRef.current.push([toLocal(e)]);
    }
    function onPointerMove(e: PointerEvent) {
      if (!drawingRef.current) return;
      const current = strokesRef.current[strokesRef.current.length - 1];
      current.push(toLocal(e));
    }
    function onPointerUp() {
      drawingRef.current = false;
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [habitCount, cleared]);

  return (
    <div className="fixed inset-0 z-50 bg-ink flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">Jardín zen</p>
          <p className="text-sm text-neutral-400">Traza con el dedo o el mouse. Las líneas se borran solas.</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors shrink-0 ml-4"
        >
          Cerrar
        </button>
      </div>
      <div ref={containerRef} className="relative flex-1 touch-none select-none overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" />
      </div>
      <div className="px-5 py-4 border-t border-line shrink-0 flex justify-center">
        <button
          type="button"
          onClick={() => {
            strokesRef.current = [];
            setCleared((c) => !c);
          }}
          className="text-xs uppercase tracking-widest text-neutral-500 hover:text-accent transition-colors"
        >
          Alisar la arena
        </button>
      </div>
    </div>
  );
}
