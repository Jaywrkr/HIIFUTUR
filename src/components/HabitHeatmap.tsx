"use client";

import { useRef, useState } from "react";
import { getMantraForDate } from "@/lib/mantras";

const WEEKS = 12;
const DAYS = WEEKS * 7;
const HOLD_MS = 350;

function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

type DayCell = { key: string; date: Date; inRange: boolean };

function buildGrid(): DayCell[][] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  // Every column must be a full 7-day week or the grid renders ragged (some
  // columns shorter than others). End on the Saturday of the current week —
  // that's the only anchor that keeps DAYS a multiple of 7 no matter what
  // day of the week "today" is; days after today just render as empty/inactive.
  const endDow = today.getUTCDay();
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() + (6 - endDow));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - (DAYS - 1));

  const days: DayCell[] = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    days.push({ key: toDateKey(d), date: d, inRange: d <= today });
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

export function HabitHeatmap({
  logDates,
  freezeDates,
  habitCreatedAt,
}: {
  logDates: string[];
  freezeDates: string[];
  habitCreatedAt: Date;
}) {
  const weeks = buildGrid();
  const logSet = new Set(logDates);
  const freezeSet = new Set(freezeDates);
  const createdKey = toDateKey(habitCreatedAt);

  const [selected, setSelected] = useState<DayCell | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startPress(cell: DayCell) {
    if (!cell.inRange || cell.key < createdKey) return;
    holdTimer.current = setTimeout(() => setSelected(cell), HOLD_MS);
  }

  function endPress() {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }

  return (
    <div className="mt-3">
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((cell) => {
              const beforeStart = cell.key < createdKey;
              const done = logSet.has(cell.key);
              const frozen = !done && freezeSet.has(cell.key);
              const empty = cell.inRange && !beforeStart && !done && !frozen;

              let bg = "transparent";
              if (!cell.inRange || beforeStart) bg = "transparent";
              else if (done) bg = "#FFFFFF";
              else if (frozen) bg = "#6b93c9";
              else if (empty) bg = "#5e5e5e";

              return (
                <button
                  key={cell.key}
                  type="button"
                  onPointerDown={() => startPress(cell)}
                  onPointerUp={endPress}
                  onPointerLeave={endPress}
                  onPointerCancel={endPress}
                  disabled={!cell.inRange || beforeStart}
                  aria-label={cell.key}
                  className="appearance-none block h-2.5 w-2.5 shrink-0 rounded-[2px] border-0 p-0"
                  style={{ background: bg, cursor: cell.inRange && !beforeStart ? "pointer" : "default" }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {selected ? (
        <div className="mt-3 rounded-md border border-line bg-ink p-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1">
              {selected.date.toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            <p className="text-sm text-neutral-300">
              {logSet.has(selected.key)
                ? "Hecho ese día."
                : freezeSet.has(selected.key)
                  ? "Racha congelada ese día."
                  : "No se marco ese día."}
            </p>
            <p className="text-xs text-neutral-500 italic mt-1">
              &ldquo;{getMantraForDate(selected.date)}&rdquo;
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-xs text-neutral-500 hover:text-accent transition-colors shrink-0"
          >
            Cerrar
          </button>
        </div>
      ) : null}
    </div>
  );
}
