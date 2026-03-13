import { test, expect } from "@playwright/test";

/**
 * Scénario complet : login puis navigation dans l'app.
 * Ne s'exécute que si E2E_USER_EMAIL et E2E_USER_PASSWORD sont définis (optionnel en CI).
 */
const E2E_EMAIL = process.env.E2E_USER_EMAIL;
const E2E_PASSWORD = process.env.E2E_USER_PASSWORD;
const SKIP_AUTH_FLOW = !E2E_EMAIL || !E2E_PASSWORD;

test.describe("Flux authentifié — après login", () => {
  test.skip(SKIP_AUTH_FLOW, "E2E_USER_EMAIL et E2E_USER_PASSWORD requis");

  test("login puis affichage de la page d'accueil", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(E2E_EMAIL!);
    await page.getByRole("textbox", { name: /mot de passe|password/i }).fill(E2E_PASSWORD!);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 15000 });
    await expect(page.getByText(/what it do|accueil/i)).toBeVisible({ timeout: 5000 });
  });

  test("login puis accès à la page messages", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(E2E_EMAIL!);
    await page.getByRole("textbox", { name: /mot de passe|password/i }).fill(E2E_PASSWORD!);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 15000 });
    await page.goto("/messages");
    await expect(page).toHaveURL(/\/messages/);
    await expect(
      page.getByRole("heading", { name: /messages/i }).or(page.getByText(/messages|conversations/i))
    ).toBeVisible({ timeout: 10000 });
  });

  test("login puis accès au calendrier", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill(E2E_EMAIL!);
    await page.getByRole("textbox", { name: /mot de passe|password/i }).fill(E2E_PASSWORD!);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 15000 });
    await page.goto("/calendar");
    await expect(page).toHaveURL(/\/calendar/);
    await expect(
      page.getByRole("heading", { name: /calendrier|calendar/i }).or(page.getByText(/calendrier/i))
    ).toBeVisible({ timeout: 10000 });
  });
});
