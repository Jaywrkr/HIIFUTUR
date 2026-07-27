import type { Page } from "@playwright/test";

/** A fresh, collision-free identity for each test run. */
export function freshUser(tag: string) {
  const uniq = `${tag}_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  return {
    name: `Test ${uniq}`,
    email: `${uniq}@example.com`,
    password: "password123",
  };
}

/** Registers a new account. Registration now auto-signs-in, so this lands
 * on /onboarding directly — no separate /login step. */
export async function register(page: Page, user: ReturnType<typeof freshUser>) {
  await page.goto("/register", { waitUntil: "networkidle" });
  await page.fill("#name", user.name);
  await page.fill("#email", user.email);
  await page.fill("#password", user.password);
  await page.click('button[type=submit]');
  await page.waitForURL("**/onboarding", { timeout: 15_000 });
}

/** Completes both onboarding steps, including confirming the Radar de Vida
 * warning dialog, and lands on /modules. Dismisses the welcome tour by
 * default; pass skipTour: false to leave it up (e.g. to assert on it). */
export async function completeOnboarding(
  page: Page,
  { area = "Salud", skipTour = true }: { area?: string; skipTour?: boolean } = {}
) {
  await page.click(`text=${area}`);
  await page.click("text=CONTINUAR");
  await page.click("text=EMPEZAR MI SISTEMA");
  await page.click("text=Sí, así estoy hoy");
  await page.waitForURL("**/modules**", { timeout: 15_000 });

  if (skipTour) {
    const skip = page.locator("text=SALTAR");
    if (await skip.isVisible().catch(() => false)) {
      await skip.click();
    }
  }
}

/** Completes Module 1's exercise (causa raíz + hábito ancla), which is the
 * exclusive gate for creating the first habit. */
export async function completeModule1(page: Page, habitName = "Estudiar 5 minutos") {
  await page.goto("/modules/por-que-fallas", { waitUntil: "networkidle" });
  await page.click("text=Empezaba demasiado grande");
  await page.fill('input[name="habito_1"]', habitName);
  await page.click("text=Me da un poco de vergüenza lo pequeño que es (perfecto)");
  await page.click("text=MARCAR COMO COMPLETADO");
  await page.waitForURL("**/modules", { timeout: 15_000 });
}
