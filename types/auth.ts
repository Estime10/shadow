/**
 * Types de résultat des actions auth.
 * Pour la forme des données de formulaire, utiliser les types des schémas :
 * LoginSchemaOutput / RegisterSchemaOutput depuis @/features/auth.
 */
export type LoginResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };

export type RegisterResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };
