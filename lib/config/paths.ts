/**
 * Chemins utilisés pour revalidatePath (Server Actions).
 * Centralise les chaînes pour éviter les magic strings et faciliter les changements.
 */
export const PATHS = {
  CALENDAR: "/calendar",
  MESSAGES: "/messages",
  /** Chemin d'une conversation (ex. revalidatePath après create/update/delete message). */
  messageConversation: (conversationId: string): string => `/messages/${conversationId}`,
} as const;
