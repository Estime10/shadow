"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { FormGlobalError } from "@/components/ui/FormGlobalError/FormGlobalError";
import { Button } from "@/components/ui/Button/Button";
import { loginAction } from "../login/loginAction/loginAction";
import { loginSchema, type LoginSchemaOutput } from "../login/schema/loginSchema";
import { LoginFormFields } from "./LoginFormFields/LoginFormFields";
import { LoginFormFooter } from "./LoginFormFooter/LoginFormFooter";

export function LoginForm() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchemaOutput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginSchemaOutput) {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("password", data.password);
      const result = await loginAction(formData);
      if (!result.success) {
        setError("root", { message: result.error });
      }
    } catch (err) {
      if (isRedirectError(err)) throw err;
      setError("root", { message: "Une erreur est survenue." });
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <LoginFormFields register={register} errors={errors} disabled={isPending} />
        {errors.root?.message ? <FormGlobalError message={errors.root.message} /> : null}
        <Button type="submit" variant="primary" fullWidth disabled={isPending}>
          {submitContent}
        </Button>
      </form>
      <LoginFormFooter />
    </Card>
  );
}
