"use server";

import { redirect } from "next/navigation";
import type { RegisterResult } from "@/types/auth";
import { registerSchema } from "../schema/schema";
import { createClient } from "@/lib/supabase/server";

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
    username: formData.get("username"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const message =
      first.email?.[0] ?? first.password?.[0] ?? first.username?.[0] ?? "Données invalides";
    return { success: false, error: message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Si confirmation email est activée dans Supabase : pas de session, il faut confirmer.
  if (data.session) {
    redirect("/");
  }

  // Inscription OK, email de confirmation envoyé (ou mode sans confirmation).
  redirect("/login?registered=1");
}
