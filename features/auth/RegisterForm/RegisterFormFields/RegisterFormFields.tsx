"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/Input/Input";
import { PasswordInput } from "@/components/ui/PasswordInput/PasswordInput";
import type { RegisterSchemaOutput } from "@/features/auth/register/schema/registerSchema";

type RegisterFormFieldsProps = {
  register: UseFormRegister<RegisterSchemaOutput>;
  errors: FieldErrors<RegisterSchemaOutput>;
  disabled: boolean;
};

export function RegisterFormFields({ register, errors, disabled }: RegisterFormFieldsProps) {
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
      <Input
        label="Pseudo"
        type="text"
        autoComplete="username"
        placeholder="Votre pseudo"
        required
        disabled={disabled}
        error={errors.username?.message}
        {...register("username")}
      />
      <PasswordInput
        label="Mot de passe"
        autoComplete="new-password"
        placeholder="Au moins 8 caractères"
        required
        disabled={disabled}
        error={errors.password?.message}
        {...register("password")}
      />
    </>
  );
}
