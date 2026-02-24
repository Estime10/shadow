"use client";

import { useState } from "react";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { loginAction } from "./login/loginAction";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      const result = await loginAction(formData);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError("Une erreur est survenue.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 h-1 w-10 bg-[var(--accent)]" />
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <form action={handleSubmit} className="flex flex-col gap-5">
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="vous@exemple.com"
          required
          disabled={isPending}
        />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
        {error ? (
          <p className="text-sm text-[var(--error)]" role="alert">
            {error}
          </p>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isPending}
        >
          {isPending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Pas de compte ?{" "}
        <Link
          href="/register"
          className="font-display font-bold uppercase tracking-wider text-[var(--accent)] hover:underline"
        >
          S’inscrire
        </Link>
      </p>
    </Card>
  );
}
