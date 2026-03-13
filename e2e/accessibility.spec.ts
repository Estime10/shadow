import { test, expect } from "@playwright/test";

test.describe("Accessibilité — formulaires auth", () => {
  test("formulaire login a des labels associés aux champs", async ({ page }) => {
    await page.goto("/login");
    const email = page.getByRole("textbox", { name: /email|e-mail/i });
    const password = page.getByRole("textbox", { name: /mot de passe|password/i });
    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
  });

  test("erreur de login est exposée via role alert", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill("a@b.com");
    await page.getByRole("textbox", { name: /mot de passe|password/i }).fill("wrong");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 8000 });
  });

  test("formulaire register a un champ pseudo avec label", async ({ page }) => {
    await page.goto("/register");
    const username = page.getByRole("textbox", { name: /pseudo|username/i });
    await expect(username).toBeVisible();
  });
});
