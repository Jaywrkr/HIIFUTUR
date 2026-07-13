import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { PageHeader } from "@/components/PageHeader";
import { WheelRadarChart } from "@/components/WheelRadarChart";
import { WheelMeasurementForm } from "@/components/WheelMeasurementForm";
import { ShareWheelButton } from "@/components/ShareWheelButton";
import { requireUser } from "@/lib/session";
import { getUserPreferences, getWheelMeasurements, getHabitsForUser, getAccessStatus } from "@/lib/queries";
import { hasActiveAccess } from "@/lib/access";
import { addDays } from "@/lib/habit-utils";
import { DAYS_BETWEEN_WHEEL_MEASUREMENTS, WHEEL_AREAS, WHEEL_AREA_TO_CATEGORY } from "@/lib/constants";

export const metadata: Metadata = { robots: { index: false, follow: false } };

function buildInsight(
  current: Record<string, number>,
  previous: Record<string, number>,
  activeHabitCategories: Set<string>
): string | null {
  let bestArea: string | null = null;
  let bestDelta = 0;

  for (const area of WHEEL_AREAS) {
    const delta = (current[area.id] ?? 0) - (previous[area.id] ?? 0);
    if (delta > bestDelta) {
      bestDelta = delta;
      bestArea = area.id;
    }
  }

  if (!bestArea || bestDelta <= 0) return null;

  const areaLabel = WHEEL_AREAS.find((a) => a.id === bestArea)?.label;
  const relatedCategory = WHEEL_AREA_TO_CATEGORY[bestArea];
  const hasMatchingHabit = activeHabitCategories.has(relatedCategory);

  if (hasMatchingHabit) {
    return `Este mes mejoraste en ${areaLabel} (+${bestDelta}). Eso correlaciona con tus hábitos activos. El sistema funciona.`;
  }
  return `Este mes mejoraste en ${areaLabel} (+${bestDelta}). Sigue sosteniendo el sistema.`;
}

export default async function WheelPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);
  if (!prefs) redirect("/onboarding");

  const access = await getAccessStatus(user.id);
  if (!access || !hasActiveAccess(access)) redirect("/upgrade");

  const measurements = await getWheelMeasurements(user.id);
  const habits = await getHabitsForUser(user.id);
  const activeHabitCategories = new Set(
    habits.filter((h) => h.status === "active").map((h) => h.category)
  );

  const latest = measurements[0];
  const previous = measurements[1];

  const nextAllowed = latest
    ? addDays(latest.measurementDate, DAYS_BETWEEN_WHEEL_MEASUREMENTS)
    : null;
  const canMeasure = !nextAllowed || new Date() >= nextAllowed;

  const insight =
    latest && previous
      ? buildInsight(
          latest.areaScores as Record<string, number>,
          previous.areaScores as Record<string, number>,
          activeHabitCategories
        )
      : null;

  return (
    <>
      <Nav />
      <main className="app-main">
        <PageHeader
          kicker="CONTROL · 3 DE 3"
          title="Wheel of Life"
          subtitle={`Este es el control: la brújula que dice si el aprendizaje y la acción están moviendo algo. Cada ${DAYS_BETWEEN_WHEEL_MEASUREMENTS} días mides dónde estás. Sin drama, solo la realidad.`}
        />

        {latest ? (
          <div className="card mb-8">
            <WheelRadarChart
              current={latest.areaScores as Record<string, number>}
              previous={previous ? (previous.areaScores as Record<string, number>) : undefined}
            />
            {insight ? <p className="text-sm text-accent mt-4">{insight}</p> : null}
            <div className="mt-4">
              <ShareWheelButton
                areaScores={latest.areaScores as Record<string, number>}
                areaLabels={WHEEL_AREAS.map((a) => ({ id: a.id, label: a.label }))}
              />
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <p className="text-2xl mb-2">🎯</p>
            <p className="muted">Aún no tienes mediciones.</p>
          </div>
        )}

        {canMeasure ? (
          <WheelMeasurementForm lastScores={latest?.areaScores as Record<string, number> | undefined} />
        ) : (
          <p className="muted">
            Tu siguiente medición está disponible el {nextAllowed?.toLocaleDateString("es-MX")}.
          </p>
        )}
      </main>
    </>
  );
}
