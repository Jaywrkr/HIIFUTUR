import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { AchievementsGallery } from "@/components/AchievementsGallery";
import { requireUser } from "@/lib/session";
import { getUserById, getAccessStatus } from "@/lib/queries";
import { hasActiveAccess } from "@/lib/access";
import { getAchievementStats, evaluateAndGrantAchievements } from "@/lib/achievement-actions";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function LogrosPage() {
  const sessionUser = await requireUser();
  const access = await getAccessStatus(sessionUser.id);
  if (!access || !hasActiveAccess(access)) redirect("/upgrade");

  const user = await getUserById(sessionUser.id);
  if (!user) redirect("/login");

  const stats = await getAchievementStats(user);
  const { progress } = await evaluateAndGrantAchievements(user.id, stats);

  const unlockedCount = progress.filter((p) => p.earnedTier > 0).length;

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker={`${unlockedCount} de ${progress.length} desbloqueados`}
          title="Logros"
          subtitle="No son insignias por usar la app — son evidencia de lo que ya sostuviste. Cada uno tiene hasta 3 niveles, y suben con datos reales, no con calendario."
        />

        <AchievementsGallery progress={progress} />
      </main>
    </>
  );
}
