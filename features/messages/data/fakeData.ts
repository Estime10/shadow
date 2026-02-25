import type { Conversation, Message } from "@/types/message";
import { formatRelativeTime } from "@/lib/functions";

const NOW = new Date();
const MIN_5 = new Date(NOW.getTime() - 5 * 60 * 1000);
const MIN_15 = new Date(NOW.getTime() - 15 * 60 * 1000);
const HOUR_1 = new Date(NOW.getTime() - 60 * 60 * 1000);
const YESTERDAY = new Date(NOW.getTime() - 24 * 60 * 60 * 1000);

const ME = "me";
const ALEX = "alex";
const JORDAN = "jordan";
const SAM = "sam";

export const FAKE_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participant: { id: ALEX, name: "Alex", avatar: null },
    lastMessage: {
      text: "Ce soir ça te dit ? J'amène les boards",
      createdAt: MIN_5.toISOString(),
      senderId: ALEX,
    },
    unreadCount: 2,
  },
  {
    id: "conv-2",
    participant: { id: JORDAN, name: "Jordan", avatar: null },
    lastMessage: {
      text: "Ok pour demain 18h au spot",
      createdAt: MIN_15.toISOString(),
      senderId: ME,
    },
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participant: { id: SAM, name: "Sam", avatar: null },
    lastMessage: {
      text: "La vidéo est grave bien 🔥",
      createdAt: HOUR_1.toISOString(),
      senderId: SAM,
    },
    unreadCount: 1,
  },
];

export const FAKE_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "m1",
      conversationId: "conv-1",
      senderId: ME,
      text: "Yo, vous faites quoi ce week-end ?",
      createdAt: YESTERDAY.toISOString(),
    },
    {
      id: "m2",
      conversationId: "conv-1",
      senderId: ALEX,
      text: "On part au spot si ça te tente",
      createdAt: YESTERDAY.toISOString(),
    },
    {
      id: "m3",
      conversationId: "conv-1",
      senderId: ME,
      text: "Chaud, je suis partant",
      createdAt: HOUR_1.toISOString(),
    },
    {
      id: "m4",
      conversationId: "conv-1",
      senderId: ALEX,
      text: "Ce soir ça te dit ? J'amène les boards",
      createdAt: MIN_5.toISOString(),
    },
  ],
  "conv-2": [
    {
      id: "m5",
      conversationId: "conv-2",
      senderId: JORDAN,
      text: "Tu dispo demain ?",
      createdAt: HOUR_1.toISOString(),
    },
    {
      id: "m6",
      conversationId: "conv-2",
      senderId: ME,
      text: "Oui, plutôt en fin d'après-midi",
      createdAt: MIN_15.toISOString(),
    },
    {
      id: "m7",
      conversationId: "conv-2",
      senderId: ME,
      text: "Ok pour demain 18h au spot",
      createdAt: MIN_15.toISOString(),
    },
  ],
  "conv-3": [
    {
      id: "m8",
      conversationId: "conv-3",
      senderId: SAM,
      text: "T'as vu le dernier edit ?",
      createdAt: HOUR_1.toISOString(),
    },
    {
      id: "m9",
      conversationId: "conv-3",
      senderId: ME,
      text: "Pas encore, je regarde ce soir",
      createdAt: HOUR_1.toISOString(),
    },
    {
      id: "m10",
      conversationId: "conv-3",
      senderId: SAM,
      text: "La vidéo est grave bien 🔥",
      createdAt: HOUR_1.toISOString(),
    },
  ],
};

export function formatConversationTime(iso: string): string {
  return formatRelativeTime(iso);
}

export function getConversationById(id: string): Conversation | undefined {
  return FAKE_CONVERSATIONS.find((c) => c.id === id);
}

export function getMessagesByConversationId(conversationId: string): Message[] {
  return FAKE_MESSAGES[conversationId] ?? [];
}

export function formatMessageDate(iso: string): string {
  return formatRelativeTime(iso);
}
