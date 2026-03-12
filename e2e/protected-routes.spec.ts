import { test, expect } from "@playwright/test";

/**
 * Sans cookie de session Supabase, les routes protégées doivent rediriger vers /login.
 * On utilise un contexte sans stockage persistant pour simuler un utilisateur non connecté.
 */
test.describe("Routes protégées — redirection vers login", () => {
  test("accès à / redirige vers /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("accès à /messages redirige vers /login", async ({ page }) => {
    await page.goto("/messages");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("accès à /calendar redirige vers /login", async ({ page }) => {
    await page.goto("/calendar");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("accès à /messages/[id] redirige vers /login", async ({ page }) => {
    await page.goto("/messages/00000000-0000-0000-0000-000000000001");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});

test.describe("Routes publiques — pas de redirection", () => {
  test("/login est accessible sans auth", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText("Connexion")).toBeVisible({ timeout: 5000 });
  });

  test("/register est accessible sans auth", async ({ page }) => {
    await page.goto("/register");
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText("Inscription")).toBeVisible({ timeout: 5000 });
  });
});
