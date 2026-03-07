"use client";

import { useState } from "react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { registerAction } from "../register/registerAction/registerAction";
import { RegisterFormFields } from "./RegisterFormFields/RegisterFormFields";
import { RegisterFormActions } from "./RegisterFormActions/RegisterFormActions";
import { RegisterFormFooter } from "./RegisterFormFooter/RegisterFormFooter";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsPending(true);
    try {
      const result = await registerAction(formData);
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
      <LoadingSpinner size={18} className="text-(--bg)" aria-label="Inscription en cours" />
      <span className="ml-2">Inscription…</span>
    </>
  ) : (
    "S'inscrire"
  );

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 h-1 w-10 bg-accent" />
        <CardTitle>Inscription</CardTitle>
      </CardHeader>
      <form action={handleSubmit} className="flex flex-col gap-5">
        <RegisterFormFields disabled={isPending} />
        <RegisterFormActions error={error} isPending={isPending} submitContent={submitContent} />
      </form>
      <RegisterFormFooter />
    </Card>
  );
}
