"use server";

import { redirect } from "next/navigation";
import type { LoginResult } from "@/types/auth";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";
import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "../schema/loginSchema";

const LOGIN_KEYS = ["email", "password"] as const;

export async function loginAction(formData: FormData): Promise<LoginResult> {
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
