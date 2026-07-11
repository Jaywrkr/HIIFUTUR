import { test, expect } from "@playwright/test";
import { freshUser, register, completeOnboarding, completeModule1 } from "./helpers";

test.describe("El primer hábito depende del Módulo 1", () => {
  test("no se puede crear un hábito antes de terminar el Módulo 1", async ({ page }) => {
    const user = freshUser("gateblocked");
    await register(page, user);
    await completeOnboarding(page);

    await page.goto("/habits", { waitUntil: "networkidle" });

    await expect(page.locator("text=Tu hábito ancla se elige en el Módulo 1")).toBeVisible();
    await expect(page.locator("#name")).not.toBeVisible();
  });

  test("terminar el Módulo 1 desbloquea la creación del primer hábito", async ({ page }) => {
    const user = freshUser("gateunlocked");
    await register(page, user);
    await completeOnboarding(page);
    await completeModule1(page, "Estudiar 5 minutos");

    await page.goto("/habits", { waitUntil: "networkidle" });
    await expect(page.locator("text=Tu hábito ancla se elige en el Módulo 1")).not.toBeVisible();

    await page.fill("#name", "Estudiar 5 minutos");
    await page.fill("#description", "Después de despertar, estudio 5 minutos");
    await page.click('button:has-text("CREAR HÁBITO")');

    await expect(page.locator("text=Estudiar 5 minutos").first()).toBeVisible();
  });
});
