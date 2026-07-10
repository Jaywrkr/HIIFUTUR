import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { requireUser } from "@/lib/session";
import { getTopUsers, LEADERBOARD_SIZE } from "@/lib/queries";
import { computeLevel } from "@/lib/leveling";

export default async function LeaderboardPage() {
  const user = await requireUser();
  const topUsers = await getTopUsers();

  const rows = [...topUsers];
  while (rows.length < LEADERBOARD_SIZE) {
    rows.push(null as unknown as (typeof rows)[number]);
  }

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker="TOP 10"
          title="Leaderboard"
          subtitle="Puntos por cada hábito marcado. Entre más alto el nivel, más cuesta subir."
        />

        <div className="flex flex-col gap-1">
          {rows.map((row, i) =>
            row ? (
              <div
                key={row.id}
                className={
                  row.id === user.id
                    ? "flex items-center justify-between border border-accent/50 bg-accent/10 rounded-xl px-4 py-3"
                    : "flex items-center justify-between border-b border-line px-4 py-3"
                }
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-neutral-500">{i + 1}</span>
                  <span className="font-semibold">
                    {row.name?.trim() || "Usuario"}
                    {row.id === user.id ? <span className="text-accent"> (tu)</span> : null}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-neutral-500">
                  <span>Nv. {computeLevel(row.points).level}</span>
                  <span className="text-neutral-300">{row.points} pts</span>
                </div>
              </div>
            ) : (
              <div key={`empty-${i}`} className="flex items-center justify-between border-b border-line px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold text-neutral-700">{i + 1}</span>
                  <span className="text-neutral-700">-----</span>
                </div>
                <span className="text-xs text-neutral-700">-----</span>
              </div>
            )
          )}
        </div>
      </main>
    </>
  );
}
