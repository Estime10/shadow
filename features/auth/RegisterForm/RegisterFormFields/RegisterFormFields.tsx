"use client";

import { Input } from "@/components/ui/Input/Input";

type RegisterFormFieldsProps = {
  disabled: boolean;
};

export function RegisterFormFields({ disabled }: RegisterFormFieldsProps) {
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
        label="Pseudo"
        name="username"
        type="text"
        autoComplete="username"
        placeholder="Votre pseudo"
        required
        disabled={disabled}
      />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Au moins 8 caractères"
        required
        disabled={disabled}
      />
    </>
  );
}
