import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().min(1, "L'email est requis").email("Email invalide"),
    password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    username: z.string().min(1, "Le pseudo est requis").max(50, "Pseudo trop long"),
  })
  .strict();

export type RegisterSchemaInput = z.input<typeof registerSchema>;
export type RegisterSchemaOutput = z.output<typeof registerSchema>;
