// Renders shareable PNG cards on an in-memory canvas — no server round trip,
// no external image service. Only ever draws the user's real numbers; never
// fabricate a stat that didn't happen.

const WIDTH = 1080;
const HEIGHT = 1350;

const INK = "#0F0C09";
const SURFACE = "#17130F";
const LINE = "#2B241C";
const ACCENT = "#E3C9A0";
const CREAM = "#F2ECE2";
const MUTED = "#8a8072";

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Faint dot grid, echoing the landing hero.
  ctx.fillStyle = "rgba(227,201,160,0.12)";
  const gap = 44;
  for (let x = gap; x < WIDTH; x += gap) {
    for (let y = gap; y < HEIGHT; y += gap) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawWordmark(ctx: CanvasRenderingContext2D, y: number) {
  ctx.fillStyle = CREAM;
  ctx.font = "700 34px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.save();
  ctx.letterSpacing = "10px";
  ctx.fillText("EJECUTA", WIDTH / 2, y);
  ctx.restore();
}

function drawKicker(ctx: CanvasRenderingContext2D, text: string, y: number) {
  const paddingX = 28;
  ctx.font = "700 22px sans-serif";
  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = 56;
  const x = WIDTH / 2 - boxWidth / 2;

  ctx.fillStyle = SURFACE;
  ctx.strokeStyle = LINE;
  ctx.lineWidth = 2;
  const r = boxHeight / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + boxWidth, y, x + boxWidth, y + boxHeight, r);
  ctx.arcTo(x + boxWidth, y + boxHeight, x, y + boxHeight, r);
  ctx.arcTo(x, y + boxHeight, x, y, r);
  ctx.arcTo(x, y, x + boxWidth, y, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = ACCENT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, WIDTH / 2, y + boxHeight / 2 + 2);
}

export function drawStreakShareCard(
  canvas: HTMLCanvasElement,
  { habitName, streak }: { habitName: string; streak: number }
) {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  drawBackground(ctx);
  drawKicker(ctx, "SISTEMA DE EJECUCIÓN SOSTENIBLE", 90);

  ctx.textAlign = "center";
  ctx.font = "150px sans-serif";
  ctx.fillText("🔥", WIDTH / 2, 500);

  ctx.fillStyle = ACCENT;
  ctx.font = "800 200px sans-serif";
  ctx.fillText(String(streak), WIDTH / 2, 720);

  ctx.fillStyle = CREAM;
  ctx.font = "700 44px sans-serif";
  ctx.save();
  ctx.letterSpacing = "6px";
  ctx.fillText(streak === 1 ? "DÍA SEGUIDO" : "DÍAS SEGUIDOS", WIDTH / 2, 850);
  ctx.restore();

  ctx.fillStyle = MUTED;
  ctx.font = "36px sans-serif";
  const habitLine = habitName.length > 40 ? `${habitName.slice(0, 40)}…` : habitName;
  ctx.fillText(habitLine, WIDTH / 2, 950);

  drawWordmark(ctx, HEIGHT - 130);
  ctx.fillStyle = MUTED;
  ctx.font = "28px sans-serif";
  ctx.fillText("Un sistema, no una promesa.", WIDTH / 2, HEIGHT - 80);
}

const WHEEL_HEIGHT = 1750;

export function drawWheelShareCard(
  canvas: HTMLCanvasElement,
  { areaScores, areaLabels }: { areaScores: Record<string, number>; areaLabels: { id: string; label: string }[] }
) {
  canvas.width = WIDTH;
  canvas.height = WHEEL_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, WIDTH, WHEEL_HEIGHT);
  ctx.fillStyle = "rgba(227,201,160,0.12)";
  const gap = 44;
  for (let x = gap; x < WIDTH; x += gap) {
    for (let y = gap; y < WHEEL_HEIGHT; y += gap) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawKicker(ctx, "MI WHEEL OF LIFE", 90);

  const values = areaLabels.map((a) => areaScores[a.id] ?? 0);
  const average = values.reduce((sum, v) => sum + v, 0) / (values.length || 1);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = ACCENT;
  ctx.font = "800 170px sans-serif";
  ctx.fillText(average.toFixed(1), WIDTH / 2, 400);
  ctx.fillStyle = MUTED;
  ctx.font = "700 32px sans-serif";
  ctx.save();
  ctx.letterSpacing = "4px";
  ctx.fillText("PROMEDIO SOBRE 10", WIDTH / 2, 450);
  ctx.restore();

  // Horizontal bars, one per area, sorted by score for quick reading.
  const sorted = areaLabels
    .map((a) => ({ label: a.label, score: areaScores[a.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const barHeight = 32;
  const labelHeight = 40;
  const rowGap = 24;
  const rowHeight = labelHeight + barHeight + rowGap;
  const barsTop = 540;
  const barMaxWidth = 760;
  const barStartX = 160;

  ctx.textAlign = "left";

  sorted.forEach((row, i) => {
    const rowTop = barsTop + i * rowHeight;
    const barTop = rowTop + labelHeight;

    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = CREAM;
    ctx.font = "600 28px sans-serif";
    ctx.fillText(row.label, barStartX, rowTop + labelHeight - 10);

    ctx.fillStyle = LINE;
    ctx.beginPath();
    ctx.roundRect(barStartX, barTop, barMaxWidth, barHeight, 16);
    ctx.fill();

    const fillWidth = Math.max(barMaxWidth * (row.score / 10), barHeight);
    ctx.fillStyle = ACCENT;
    ctx.beginPath();
    ctx.roundRect(barStartX, barTop, fillWidth, barHeight, 16);
    ctx.fill();

    ctx.fillStyle = INK;
    ctx.font = "700 20px sans-serif";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(String(row.score), barStartX + fillWidth - 14, barTop + barHeight / 2 + 1);
    ctx.textAlign = "left";
  });

  drawWordmark(ctx, WHEEL_HEIGHT - 130);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = MUTED;
  ctx.font = "28px sans-serif";
  ctx.fillText("Un sistema, no una promesa.", WIDTH / 2, WHEEL_HEIGHT - 80);
}
