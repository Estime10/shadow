import { test, expect } from "@playwright/test";

test.describe("Auth — pages et formulaires", () => {
  test("page login affiche le formulaire et les champs", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("textbox", { name: /email|e-mail/i })).toBeVisible();
    await expect(page.getByLabel(/mot de passe|password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible();
  });

  test("page register affiche le formulaire et les champs", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "Inscription" })).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByRole("textbox", { name: /email|e-mail/i })).toBeVisible();
    await expect(page.getByLabel(/mot de passe|password/i)).toBeVisible();
    await expect(page.getByRole("textbox", { name: /pseudo|username/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /s'inscrire|inscrire/i })).toBeVisible();
  });

  test("login avec identifiants invalides affiche une erreur", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill("invalid@test.com");
    await page.getByLabel(/mot de passe|password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.getByText(/email ou mot de passe incorrect|invalid/i)).toBeVisible({
      timeout: 8000,
    });
  });

  test("login avec email vide ne soumet pas (validation navigateur) ou affiche une erreur", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel(/mot de passe|password/i).fill("somepassword");
    await page.getByRole("button", { name: /se connecter/i }).click();
    // Avec required sur l'email, le navigateur bloque la soumission → on reste sur /login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });

  test("register avec mot de passe trop court affiche une erreur", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("textbox", { name: /email|e-mail/i }).fill("test@example.com");
    await page.getByLabel(/mot de passe|password/i).fill("short");
    await page.getByRole("textbox", { name: /pseudo|username/i }).fill("user");
    await page.getByRole("button", { name: /s'inscrire|inscrire/i }).click();
    await expect(page.getByText(/8.*caractères|mot de passe.*8/i)).toBeVisible({ timeout: 5000 });
  });

  test("login avec query registered=1 affiche le message de confirmation", async ({ page }) => {
    await page.goto("/login?registered=1");
    await expect(page.getByText(/compte créé|connectez-vous/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
  });
});

test.describe("Auth — navigation entre login et register", () => {
  test("depuis login, le lien S'inscrire mène vers /register", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /s'inscrire|inscrire/i }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole("heading", { name: "Inscription" })).toBeVisible({ timeout: 5000 });
  });

  test("depuis register, le lien Se connecter mène vers /login", async ({ page }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible({ timeout: 5000 });
  });

  test("depuis register, le lien Retour à l'accueil mène vers / ou /login (redir si non auth)", async ({
    page,
  }) => {
    await page.goto("/register");
    await page.getByRole("link", { name: /retour à l'accueil/i }).click();
    await expect(page).toHaveURL(/\/(\?.*)?$|\/login$/);
  });
});
