export type LoginFormData = {
  email: string;
  password: string;
};

export type LoginResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };

export type RegisterFormData = {
  email: string;
  password: string;
  username?: string;
};

export type RegisterResult =
  | { success: true; redirectTo?: string }
  | { success: false; error: string };
