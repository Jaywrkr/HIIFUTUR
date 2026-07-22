"use client";

import { useEffect, useRef, useState } from "react";

type Point = { x: number; y: number; t: number };
type Stroke = Point[];
type Stone = { x: number; y: number; r: number; angleOffsets: number[]; hue: number };

const TRAIL_LIFETIME_MS = 5000;
const TINES = 4;
const TINE_SPACING = 3.4;
const RIDGE_SPACING = 7;

const SAND_RIDGE = "rgba(255,255,255,0.16)";
const SAND_GROOVE = "rgba(0,0,0,0.22)";

/** Small stones scattered on the sand — count and position derived from the
 * user's own habit count, so the garden reflects what they're actually
 * tending, without turning it into another number to optimize. Shape is
 * an irregular polygon (not a perfect ellipse) so it reads as a real rock. */
function makeStones(habitCount: number, width: number, height: number): Stone[] {
  const count = Math.min(Math.max(habitCount, 1), 5);
  const stones: Stone[] = [];
  for (let i = 0; i < count; i++) {
    const seed = (i * 137.5) % 360;
    const rad = (seed * Math.PI) / 180;
    const cx = width / 2 + Math.cos(rad) * width * 0.26;
    const cy = height / 2 + Math.sin(rad) * height * 0.22;
    const r = 13 + (i % 3) * 6;
    const angleOffsets = Array.from({ length: 10 }, () => 0.78 + Math.random() * 0.34);
    stones.push({ x: cx, y: cy, r, angleOffsets, hue: 28 + Math.random() * 12 });
  }
  return stones;
}

function irregularRadius(stone: Stone, angle: number) {
  const steps = stone.angleOffsets.length;
  const pos = ((angle / (Math.PI * 2)) % 1) * steps;
  const i0 = Math.floor(pos) % steps;
  const i1 = (i0 + 1) % steps;
  const t = pos - Math.floor(pos);
  const factor = stone.angleOffsets[i0] * (1 - t) + stone.angleOffsets[i1] * t;
  return stone.r * factor;
}

function drawMoss(ctx: CanvasRenderingContext2D, stone: Stone) {
  // A small patch of moss where the stone meets the sand — the one classic
  // real-garden detail that isn't gray or tan, so it has to stay tiny and
  // muted or it reads as decoration instead of age.
  const angle = Math.PI * 0.65 + Math.random() * 0.5;
  const dist = stone.r * 0.75;
  const mx = Math.cos(angle) * dist;
  const my = Math.sin(angle) * dist * 0.82;
  ctx.save();
  ctx.translate(stone.x + mx, stone.y + my);
  ctx.rotate(Math.random() * Math.PI);
  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, stone.r * 0.55);
  grad.addColorStop(0, "rgba(90,102,66,0.55)");
  grad.addColorStop(1, "rgba(90,102,66,0)");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(0, 0, stone.r * 0.5, stone.r * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawStone(ctx: CanvasRenderingContext2D, stone: Stone) {
  // Soft cast shadow on the sand first, offset toward "down-right" as if lit
  // from the upper left — the one light-direction cue that sells volume.
  ctx.save();
  ctx.translate(stone.x + stone.r * 0.22, stone.y + stone.r * 0.3);
  ctx.filter = "blur(3px)";
  ctx.fillStyle = "rgba(20,15,8,0.35)";
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 24) {
    const rad = irregularRadius(stone, a) * 0.95;
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad * 0.75;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // The stone itself: irregular rounded polygon, radial gradient for volume,
  // muted warm gray-brown — real river-stone coloring, not a UI accent.
  ctx.save();
  ctx.translate(stone.x, stone.y);
  ctx.beginPath();
  for (let a = 0; a <= Math.PI * 2 + 0.01; a += Math.PI / 24) {
    const rad = irregularRadius(stone, a);
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad * 0.82;
    if (a === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();

  const grad = ctx.createRadialGradient(-stone.r * 0.35, -stone.r * 0.35, 1, 0, 0, stone.r * 1.3);
  grad.addColorStop(0, `hsl(${stone.hue}, 14%, 46%)`);
  grad.addColorStop(0.6, `hsl(${stone.hue}, 12%, 34%)`);
  grad.addColorStop(1, `hsl(${stone.hue}, 14%, 22%)`);
  ctx.fillStyle = grad;
  ctx.fill();

  // A faint cool rim on the shadow side, warm highlight on the lit side —
  // cheap but effective volume cue on a flat canvas fill.
  ctx.strokeStyle = "rgba(0,0,0,0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Mineral speckle, clipped to the stone's own silhouette — flat gradient
  // fills read as plastic without some grain breaking up the surface.
  ctx.clip();
  const speckleCount = Math.floor(stone.r * stone.r * 0.6);
  for (let i = 0; i < speckleCount; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = Math.random() * stone.r;
    const sx = Math.cos(a) * d;
    const sy = Math.sin(a) * d * 0.82;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.1)";
    ctx.fillRect(sx, sy, 1, 1);
  }
  ctx.restore();
}

/** The static base layer: sand grain, concentric ripples radiating from each
 * stone (like real raked gravel around a rock), and combed straight lines
 * filling the open field, bending out of the way of every stone instead of
 * cutting through it. Rendered once per resize, not per frame. */
function paintBase(canvas: HTMLCanvasElement, width: number, height: number, stones: Stone[]) {
  const ctx2d = canvas.getContext("2d");
  if (!ctx2d) return;
  const ctx: CanvasRenderingContext2D = ctx2d;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Sand base with a soft vignette — light gathers toward the center. Real
  // raked gravel is closer to gray-beige than golden tan; the old palette
  // read more like a desert dune than crushed granite.
  const bg = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height) * 0.7);
  bg.addColorStop(0, "#c3bca0");
  bg.addColorStop(1, "#a99f80");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Soft diagonal light wash, upper-left to lower-right — the same light
  // direction the stone shadows already imply, now consistent across the
  // whole scene instead of just around each rock.
  const light = ctx.createLinearGradient(0, 0, width * 0.6, height * 0.6);
  light.addColorStop(0, "rgba(255,250,235,0.10)");
  light.addColorStop(1, "rgba(0,0,0,0.06)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, width, height);

  // Loose mottling — a handful of very faint, large soft patches so the
  // sand isn't perfectly uniform in tone, the way real crushed stone never
  // is once it's been walked and raked over time.
  for (let i = 0; i < 10; i++) {
    const mx = Math.random() * width;
    const my = Math.random() * height;
    const mr = 40 + Math.random() * 90;
    const mg = ctx.createRadialGradient(mx, my, 0, mx, my, mr);
    const darker = Math.random() > 0.5;
    mg.addColorStop(0, darker ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)");
    mg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, width, height);
  }

  function blockedByStone(x: number, y: number) {
    return stones.some((s) => {
      const maxRing = s.r + Math.min(width, height) * 0.16;
      return Math.hypot(x - s.x, (y - s.y) / 0.82) < maxRing;
    });
  }

  // A real rake is pulled by hand — no two passes are perfectly straight.
  // Two small sine waves give per-row hand imperfection; a third, much
  // wider and lower-frequency one runs across the whole field so the
  // pattern reads as flowing water (the actual motif karesansui gravel
  // represents) instead of a rigid combed grid.
  function wave(x: number, y: number, rowSeed: number) {
    const flow = Math.sin(x * 0.008 + y * 0.02) * 4.5;
    return flow + Math.sin((x + rowSeed) * 0.045) * 1.1 + Math.sin((x + rowSeed) * 0.013) * 0.6;
  }

  function strokePath(points: { x: number; y: number }[], color: string, dy: number) {
    if (points.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y + dy);
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y + dy);
    ctx.stroke();
  }

  // Concentric ripples around each stone, plus a contact shadow right at
  // its base — real stones settle into sand and compress it, leaving a
  // slightly darker ring distinct from the raked ripples further out.
  ctx.globalAlpha = 1;
  for (const stone of stones) {
    ctx.beginPath();
    ctx.ellipse(stone.x, stone.y + stone.r * 0.12, stone.r * 1.08, stone.r * 0.9, 0, 0, Math.PI * 2);
    const contactShadow = ctx.createRadialGradient(
      stone.x, stone.y, stone.r * 0.6,
      stone.x, stone.y, stone.r * 1.15
    );
    contactShadow.addColorStop(0, "rgba(0,0,0,0)");
    contactShadow.addColorStop(1, "rgba(20,15,8,0.22)");
    ctx.fillStyle = contactShadow;
    ctx.fill();
  }

  for (const stone of stones) {
    const maxRing = stone.r + Math.min(width, height) * 0.16;
    for (let radius = stone.r + 5; radius < maxRing; radius += RIDGE_SPACING) {
      const fade = 1 - (radius - stone.r) / (maxRing - stone.r);
      ctx.globalAlpha = Math.max(0, fade);
      ctx.beginPath();
      ctx.ellipse(stone.x, stone.y, radius, radius * 0.82, 0, 0, Math.PI * 2);
      ctx.strokeStyle = SAND_RIDGE;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(stone.x, stone.y + 1.3, radius, radius * 0.82, 0, 0, Math.PI * 2);
      ctx.strokeStyle = SAND_GROOVE;
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Combed lines filling the rest of the field, gently wavy like a
  // hand-pulled rake, skipping any segment inside a stone's ripple zone.
  // Row spacing itself is jittered a little — a real rake head drifts a
  // few millimeters wider or narrower pass to pass, it's never a perfect
  // grid of identical gaps.
  const step = 3;
  for (let y = 6; y < height; y += RIDGE_SPACING + (Math.random() - 0.5) * 2.2) {
    const rowSeed = y * 13.7 + Math.random() * 40;
    let segment: { x: number; y: number }[] = [];
    for (let x = 0; x <= width; x += step) {
      if (blockedByStone(x, y)) {
        strokePath(segment, SAND_RIDGE, 0);
        strokePath(segment, SAND_GROOVE, 1.6);
        segment = [];
        continue;
      }
      segment.push({ x, y: y + wave(x, y, rowSeed) });
    }
    strokePath(segment, SAND_RIDGE, 0);
    strokePath(segment, SAND_GROOVE, 1.6);
  }

  // Grain: sparse fine speckle for texture, subtle enough to read as sand
  // rather than noise.
  const grains = Math.floor((width * height) / 900);
  for (let i = 0; i < grains; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)";
    ctx.fillRect(x, y, 1, 1);
  }

  for (const stone of stones) {
    drawStone(ctx, stone);
    if (Math.random() > 0.45) drawMoss(ctx, stone);
  }

  // A handful of tiny loose pebbles scattered away from the main stones —
  // real gravel gardens are never just the big rocks and empty sand.
  const pebbleCount = 7;
  for (let i = 0; i < pebbleCount; i++) {
    let px = 0;
    let py = 0;
    let ok = false;
    for (let attempt = 0; attempt < 12 && !ok; attempt++) {
      px = 16 + Math.random() * (width - 32);
      py = 16 + Math.random() * (height - 32);
      ok = stones.every((s) => Math.hypot(px - s.x, py - s.y) > s.r + 22);
    }
    if (!ok) continue;
    const pebble: Stone = {
      x: px,
      y: py,
      r: 2.5 + Math.random() * 2,
      angleOffsets: Array.from({ length: 8 }, () => 0.8 + Math.random() * 0.3),
      hue: 28 + Math.random() * 12,
    };
    drawStone(ctx, pebble);
  }
}

export function ZenGarden({ habitCount, onClose }: { habitCount: number; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const drawingRef = useRef(false);
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
    let widthCss = 0;
    let heightCss = 0;

    function resize() {
      if (!canvas || !container) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = container.getBoundingClientRect();
      // The modal's entrance transition can fire this effect a frame before
      // the container has real layout size (width/height still 0) — painting
      // a 0x0 base canvas then crashes draw()'s drawImage every frame after.
      // Skip and retry on the next frame instead of caching a blank canvas.
      if (width === 0 || height === 0) {
        raf = requestAnimationFrame(resize);
        return;
      }
      widthCss = width;
      heightCss = height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const base = document.createElement("canvas");
      const stones = makeStones(habitCount, width, height);
      paintBase(base, width, height, stones);
      baseCanvasRef.current = base;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !baseCanvasRef.current) return;
      if (baseCanvasRef.current.width === 0 || baseCanvasRef.current.height === 0) return;
      ctx.clearRect(0, 0, widthCss, heightCss);
      ctx.drawImage(baseCanvasRef.current, 0, 0, widthCss, heightCss);

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

          const dx = p1.x - p0.x;
          const dy = p1.y - p0.y;
          const len = Math.hypot(dx, dy) || 1;
          const nx = -dy / len;
          const ny = dx / len;

          // A rake has teeth: draw several parallel grooves per stroke
          // instead of one fat line.
          for (let t = 0; t < TINES; t++) {
            const offset = (t - (TINES - 1) / 2) * TINE_SPACING;
            const ox = nx * offset;
            const oy = ny * offset;

            ctx.strokeStyle = `rgba(60,44,24,${0.32 * life})`;
            ctx.lineWidth = 2.2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p0.x + ox, p0.y + oy + 1);
            ctx.lineTo(p1.x + ox, p1.y + oy + 1);
            ctx.stroke();

            ctx.strokeStyle = `rgba(255,246,224,${0.28 * life})`;
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(p0.x + ox, p0.y + oy);
            ctx.lineTo(p1.x + ox, p1.y + oy);
            ctx.stroke();
          }
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
      <div
        className="relative flex-1 m-3 sm:m-6 rounded-lg overflow-hidden"
        style={{
          background:
            "linear-gradient(120deg, #6b4a30, #543823 50%, #6b4a30), repeating-linear-gradient(98deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 2px, transparent 2px, transparent 7px)",
          padding: "14px",
          boxShadow: "inset 0 2px 6px rgba(0,0,0,0.5)",
        }}
      >
        <div ref={containerRef} className="relative h-full w-full touch-none select-none overflow-hidden rounded-md">
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full cursor-crosshair" />
        </div>
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
