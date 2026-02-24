"use server";

import { redirect } from "next/navigation";
import type { LoginResult } from "@/types/auth";
import { loginSchema } from "./schema";

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      (first.email?.[0] ?? first.password?.[0]) ?? "Données invalides";
    return { success: false, error: message };
  }

  // TODO: appeler Supabase / API auth réelle
  // Pour l’instant on valide et redirige vers la home
  redirect("/");
}
