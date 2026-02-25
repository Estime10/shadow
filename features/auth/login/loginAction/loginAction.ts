"use server";

import { redirect } from "next/navigation";
import type { LoginResult } from "@/types/auth";
import { loginSchema } from "../schema/schema";
import { createClient } from "@/lib/supabase/server";

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message = first.email?.[0] ?? first.password?.[0] ?? "Données invalides";
    return { success: false, error: message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    const message =
      error.message === "Invalid login credentials"
        ? "Email ou mot de passe incorrect."
        : error.message;
    return { success: false, error: message };
  }

  redirect("/");
}
