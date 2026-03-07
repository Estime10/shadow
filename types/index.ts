/**
 * Point d'entrée unique pour tous les types de l'application.
 * Importer depuis ici : import type { Message, Profile, CalendarEvent } from "@/types";
 */

// Auth
export type { LoginResult, RegisterResult } from "./auth";

// Message & conversations (domaine)
export type { Message, Conversation } from "./message";

// Navigation & layout
export type { NavItem } from "./navigation";
export type { LayoutChildrenProps } from "./layout";

// Calendrier
export type { CalendarEvent } from "./calendar";

// Profils
export {
  MESSAGE_DISAPPEAR_MINUTES_OPTIONS,
  type CurrentUserProfile,
  type MessageDisappearAfterMinutes,
  type Profile,
  type ProfileRow,
} from "./profile";

// UI partagée
export type { SelectableItem } from "./ui";

// Contenus pages messages
export type { MessageIdPageContent, MessagesPageContent } from "./messages-content";

// Lignes DB et paramètres CRUD
export type {
  ConversationRow,
  CreateEventParams,
  EventRow,
  GetMessagesVisibilityOptions,
  GroupRow,
  MessageReadRow,
  MessageRow,
  UpdateEventParams,
} from "./db";
