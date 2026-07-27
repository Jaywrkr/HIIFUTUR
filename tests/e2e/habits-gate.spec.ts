import { test, expect } from "@playwright/test";
import { freshUser, register, completeOnboarding, completeModule1 } from "./helpers";

test.describe("El primer hábito depende del Módulo 1", () => {
  test("no se puede crear un hábito antes de terminar el Módulo 1", async ({ page }) => {
    const user = freshUser("gateblocked");
    await register(page, user);
    await completeOnboarding(page);

    await page.goto("/habits", { waitUntil: "networkidle" });

    await expect(page.locator("text=Tu hábito ancla se crea en el Módulo 1")).toBeVisible();
    await expect(page.locator("#name")).not.toBeVisible();
  });

  // El hábito ancla se crea automáticamente al completar el Módulo 1 (a
  // partir del campo "habito_1" del ejercicio) — no hay un formulario
  // manual de creación después, así que aquí solo se confirma que ya
  // aparece activo en /habits.
  test("terminar el Módulo 1 crea el primer hábito automáticamente", async ({ page }) => {
    const user = freshUser("gateunlocked");
    await register(page, user);
    await completeOnboarding(page);
    await completeModule1(page, "Estudiar 5 minutos");

    await page.goto("/habits", { waitUntil: "networkidle" });
    await expect(page.locator("text=Tu hábito ancla se crea en el Módulo 1")).not.toBeVisible();
    await expect(page.locator("text=Estudiar 5 minutos").first()).toBeVisible();
  });
});
