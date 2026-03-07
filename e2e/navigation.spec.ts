import { test, expect } from "@playwright/test";

test.describe("Navigation — liens et structure", () => {
  test("page login contient un lien vers register", async ({ page }) => {
    await page.goto("/login");
    const link = page.getByRole("link", { name: /s'inscrire|inscrire/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/register");
  });

  test("page register contient un lien vers login", async ({ page }) => {
    await page.goto("/register");
    const link = page.getByRole("link", { name: /se connecter/i });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "/login");
  });

  test("après redirection depuis /, on est bien sur la page login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await expect(
      page.getByRole("heading", { level: 2 }).filter({ hasText: "Connexion" })
    ).toBeVisible();
  });
});
