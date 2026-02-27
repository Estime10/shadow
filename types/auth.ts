import type { z } from "zod";
import type { loginSchema } from "@/features/auth/login/schema/schema";
import type { registerSchema } from "@/features/auth/register/schema/schema";

/** Dérivé du schéma Zod login — source de vérité unique. */
export type LoginFormData = z.infer<typeof loginSchema>;

/** Dérivé du schéma Zod register — source de vérité unique. */
export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };

export type RegisterResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };
