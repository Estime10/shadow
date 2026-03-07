"use server";

import { redirect } from "next/navigation";
import type { LoginResult } from "@/types/auth";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { createClient } from "@/lib/supabase/server";
import { getClientIdentifier, isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";
import { loginSchema } from "../schema/loginSchema";

const LOGIN_KEYS = ["email", "password"] as const;
const LOGIN_RATE_LIMIT = 10; // tentatives par 15 min

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const identifier = await getClientIdentifier();
  const key = `auth:login:${identifier}`;
  if (isRateLimited(key, LOGIN_RATE_LIMIT)) {
    return { success: false, error: RATE_LIMIT_MESSAGE };
  }

  const parsed = loginSchema.safeParse(getFormDataRaw(formData, LOGIN_KEYS));
  if (!parsed.success) return { success: false, error: getFirstZodError(parsed) };

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
