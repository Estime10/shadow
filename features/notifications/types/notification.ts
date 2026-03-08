/**
 * Types de notification pour l'UI (fake puis branchement Supabase).
 * kind = catégorie (message, event, group_chat).
 * contentKind = pour les messages : texte, image, vidéo.
 */
export type NotificationKind = "message" | "event" | "group_chat";

export type MessageContentKind = "text" | "image" | "video";

export type Notification = {
  id: string;
  kind: NotificationKind;
  /** Pour kind === "message" : type de contenu du message */
  contentKind?: MessageContentKind;
  title: string;
  description: string;
  createdAt: string;
  read?: boolean;
  href?: string;
  /** Nom de la personne ou du groupe à l'origine (ex. "Alice", "Équipe") */
  actorName?: string;
};
