"use client";

import { useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { loginAction } from "../login/loginAction/loginAction";
import { LoginFormFields } from "./LoginFormFields/LoginFormFields";
import { LoginFormActions } from "./LoginFormActions/LoginFormActions";
import { LoginFormFooter } from "./LoginFormFooter/LoginFormFooter";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      const result = await loginAction(formData);
      if (!result.success) setError(result.error);
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError("Une erreur est survenue.");
    } finally {
      setIsPending(false);
    }
  }

  const submitContent = isPending ? (
    <>
      <LoadingSpinner size={18} className="text-(--bg)" aria-label="Connexion en cours" />
      <span className="ml-2">Connexion…</span>
    </>
  ) : (
    "Se connecter"
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 h-1 w-10 bg-accent" />
        <CardTitle>Connexion</CardTitle>
      </CardHeader>
      <form action={handleSubmit} className="flex flex-col gap-5">
        <LoginFormFields disabled={isPending} />
        <LoginFormActions error={error} isPending={isPending} submitContent={submitContent} />
      </form>
      <LoginFormFooter />
    </Card>
  );
}
