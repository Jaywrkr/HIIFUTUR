import { test, expect } from "@playwright/test";
import { freshUser, register, completeOnboarding } from "./helpers";

test.describe("Registro y onboarding", () => {
  test("registrarse inicia sesión directo, sin pasar por /login", async ({ page }) => {
    const user = freshUser("reg");
    await register(page, user);
    expect(page.url()).toContain("/onboarding");
  });

  test("el Radar de Vida inicial pide confirmar antes de guardar", async ({ page }) => {
    const user = freshUser("wheelconfirm");
    await register(page, user);

    await page.click("text=Salud");
    await page.click("text=CONTINUAR");

    // Each area's slider carries an explanatory description.
    await expect(page.locator("text=Energía y cómo se siente tu cuerpo día a día")).toBeVisible();

    await page.click("text=EMPEZAR MI SISTEMA");
    await expect(page.locator("text=¿Confirmas tu línea base?")).toBeVisible();
    await expect(page.locator("text=no vas a poder editarla")).toBeVisible();

    // Canceling stays on the form instead of submitting.
    await page.click("text=Revisar de nuevo");
    await expect(page.locator("text=¿Confirmas tu línea base?")).not.toBeVisible();
    expect(page.url()).toContain("/onboarding");

    await page.click("text=EMPEZAR MI SISTEMA");
    await page.click("text=Sí, así estoy hoy");
    await page.waitForURL("**/modules**", { timeout: 15_000 });
  });

  test("completar el onboarding lleva al tour de bienvenida en /modules", async ({ page }) => {
    const user = freshUser("tour");
    await register(page, user);
    await completeOnboarding(page, { skipTour: false });

    await expect(page).toHaveURL(/\/modules/);
    await expect(page.locator("text=Tu sistema está listo")).toBeVisible();
  });
});
