export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };
