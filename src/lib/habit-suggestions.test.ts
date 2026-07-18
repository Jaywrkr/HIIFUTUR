import { describe, expect, it } from "vitest";
import { getAnchorHabitOptions } from "@/lib/habit-suggestions";

describe("getAnchorHabitOptions", () => {
  it("returns 5 options, one per category, even with no data", () => {
    const options = getAnchorHabitOptions(null, null);
    expect(options).toHaveLength(5);
    expect(new Set(options.map((o) => o.category)).size).toBe(5);
  });

  it("ranks the lowest-scoring wheel areas first", () => {
    const scores = {
      salud_fisica: 9,
      nutrición: 9,
      ejercicio: 9,
      relaciones: 9,
      trabajo_carrera: 9,
      finanzas: 2, // lowest — should surface "finanzas" high
      mentalidad: 9,
      disciplina: 9,
      descanso: 9,
      crecimiento_personal: 9,
    };
    const options = getAnchorHabitOptions(null, scores);
    expect(options[0].category).toBe("finanzas");
  });

  it("boosts a category the user picked at onboarding even over a middling deficit", () => {
    const scores = {
      salud_fisica: 5,
      nutrición: 5,
      ejercicio: 5,
      relaciones: 5,
      trabajo_carrera: 5,
      finanzas: 5,
      mentalidad: 5,
      disciplina: 4, // slightly bigger deficit than the rest
      descanso: 5,
      crecimiento_personal: 5,
    };
    const withoutPreference = getAnchorHabitOptions([], scores);
    expect(withoutPreference[0].category).toBe("disciplina");

    const withPreference = getAnchorHabitOptions(["finanzas"], scores);
    expect(withPreference[0].category).toBe("finanzas");
  });

  it("drops exactly one of the six categories to stay at 5", () => {
    const options = getAnchorHabitOptions(["salud"], { finanzas: 9 });
    const categories = options.map((o) => o.category);
    expect(categories).not.toContain("finanzas");
  });
});
