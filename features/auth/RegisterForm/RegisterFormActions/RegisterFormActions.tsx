"use client";

import { type ReactNode } from "react";
import { Button } from "@/components/ui/Button/Button";

type RegisterFormActionsProps = {
  error: string | null;
  isPending: boolean;
  submitContent: ReactNode;
};

export function RegisterFormActions({ error, isPending, submitContent }: RegisterFormActionsProps) {
  return (
    <>
      {error ? (
        <p className="text-sm text-(--error)" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" fullWidth disabled={isPending}>
        {submitContent}
      </Button>
    </>
  );
}
