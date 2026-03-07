"use client";

import { Input } from "@/components/ui/Input/Input";

type LoginFormFieldsProps = {
  disabled: boolean;
};

export function LoginFormFields({ disabled }: LoginFormFieldsProps) {
  return (
    <>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="vous@exemple.com"
        required
        disabled={disabled}
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        disabled={disabled}
      />
    </>
  );
}
