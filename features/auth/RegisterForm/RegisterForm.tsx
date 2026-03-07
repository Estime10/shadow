"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner/LoadingSpinner";
import { FormGlobalError } from "@/components/ui/FormGlobalError/FormGlobalError";
import { Button } from "@/components/ui/Button/Button";
import { registerAction } from "../register/registerAction/registerAction";
import { registerSchema, type RegisterSchemaOutput } from "../register/schema/registerSchema";
import { RegisterFormFields } from "./RegisterFormFields/RegisterFormFields";
import { RegisterFormFooter } from "./RegisterFormFooter/RegisterFormFooter";

export function RegisterForm() {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterSchemaOutput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", username: "", password: "" },
  });

  async function onSubmit(data: RegisterSchemaOutput) {
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("email", data.email);
      formData.set("username", data.username);
      formData.set("password", data.password);
      const result = await registerAction(formData);
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <RegisterFormFields register={register} errors={errors} disabled={isPending} />
        {errors.root?.message ? <FormGlobalError message={errors.root.message} /> : null}
        <Button type="submit" variant="primary" fullWidth disabled={isPending}>
          {submitContent}
        </Button>
      </form>
      <RegisterFormFooter />
    </Card>
  );
}
