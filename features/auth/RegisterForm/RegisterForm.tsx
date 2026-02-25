"use client";

import { useState } from "react";
import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { registerAction } from "../register/registerAction/registerAction";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      const result = await registerAction(formData);
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
        <CardTitle>Inscription</CardTitle>
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
          label="Pseudo"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="Votre pseudo"
          required
          disabled={isPending}
        />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="Au moins 8 caractères"
          required
          disabled={isPending}
        />
        {error ? (
          <p className="text-sm text-(--error)" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="primary" fullWidth disabled={isPending}>
          {isPending ? "Inscription…" : "S'inscrire"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-(--text-muted)">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-display font-bold uppercase tracking-wider text-accent">
          Se connecter
        </Link>
      </p>
    </Card>
  );
}
