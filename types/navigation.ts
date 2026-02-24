export type NavItem = {
  href: string;
  label: string;
  icon?: string;
  badge?: number | null;
};

export const APP_NAME = "Ghost Riders" as const;
export const APP_SHORT_NAME = "Ghost" as const;
