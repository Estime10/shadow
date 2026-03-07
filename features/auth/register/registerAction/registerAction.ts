"use server";

import { redirect } from "next/navigation";
import type { RegisterResult } from "@/types/auth";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { createClient } from "@/lib/supabase/server";
import { getClientIdentifier, isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";
import { registerSchema } from "../schema/registerSchema";

const REGISTER_KEYS = ["email", "password", "username"] as const;
const REGISTER_RATE_LIMIT = 5; // tentatives par 15 min

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const identifier = await getClientIdentifier();
  const key = `auth:register:${identifier}`;
  if (isRateLimited(key, REGISTER_RATE_LIMIT)) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  const parsed = registerSchema.safeParse(getFormDataRaw(formData, REGISTER_KEYS));
  if (!parsed.success) return { success: false, error: getFirstZodError(parsed) };

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
