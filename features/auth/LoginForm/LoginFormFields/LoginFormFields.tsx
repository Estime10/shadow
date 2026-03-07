"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/Input/Input";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import type { LoginSchemaOutput } from "@/features/auth/login/schema/loginSchema";

type LoginFormFieldsProps = {
  register: UseFormRegister<LoginSchemaOutput>;
  errors: FieldErrors<LoginSchemaOutput>;
  disabled: boolean;
};

export function LoginFormFields({ register, errors, disabled }: LoginFormFieldsProps) {
  return (
    <>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="vous@exemple.com"
        required
        disabled={disabled}
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordInput
        label="Mot de passe"
        autoComplete="current-password"
        required
        disabled={disabled}
        error={errors.password?.message}
        {...register("password")}
      />
    </>
  );
}
