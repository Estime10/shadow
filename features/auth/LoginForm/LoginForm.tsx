"use client";

import { useState } from "react";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { loginAction } from "../login/loginAction/loginAction";

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
        <div className="mb-2 h-1 w-10 bg-accent" />
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
          <p className="text-sm text-(--error)" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="primary" fullWidth disabled={isPending}>
          {isPending ? (
            <>
              <LoadingSpinner size={18} className="text-(--bg)" aria-label="Connexion en cours" />
              <span className="ml-2">Connexion…</span>
            </>
          ) : (
            "Se connecter"
          )}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-(--text-muted)">
        Pas de compte ?{" "}
        <Link
          href="/register"
          className="font-display font-bold uppercase tracking-wider text-accent"
        >
          S&apos;inscrire
        </Link>
      </p>
    </Card>
  );
}
