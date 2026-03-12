import type { Notification } from "@/features/notifications/types/notification";
import type { CalendarEvent } from "@/types/calendar";
import {
  getConversationIdsForCurrentUser,
  getConversationsByIds,
  getCurrentUserProfile,
  getEvents,
  getLastMessagesForConversations,
  getProfiles,
  getReadAtByMessageIds,
} from "@/lib/supabase/CRUD";
import { getParticipantDisplayName } from "@/features/messages/data/helpers/helpers";

const MESSAGE_NOTIFICATION_TITLE = "Nouveau message";
const EVENT_NOTIFICATION_TITLE_PREFIX = "Événement";
const GROUP_ACTOR_NAME = "Groupe";

/**
 * Liste des notifications pour l'utilisateur connecté : messages non lus (par conversation) + événements récents.
 * Remplace les données fake par les vraies (Supabase).
 */
export async function getNotificationsForCurrentUser(): Promise<Notification[]> {
  const [profile, conversationIds] = await Promise.all([
    getCurrentUserProfile(),
    getConversationIdsForCurrentUser(),
  ]);
  const currentUserId = profile?.id ?? null;
  if (!currentUserId || conversationIds.length === 0) {
    const events = await getEvents({ from: new Date().toISOString() });
    return mapEventsToNotifications(events.slice(0, 10));
  }

  const [convRows, lastMessagesMap] = await Promise.all([
    getConversationsByIds(conversationIds),
    getLastMessagesForConversations(conversationIds),
  ]);

  const messageNotifications: Notification[] = [];
  const senderIds = new Set<string>();

  for (const row of convRows) {
    const lastMessage = lastMessagesMap.get(row.id);
    if (!lastMessage || lastMessage.senderId === currentUserId) continue;
    senderIds.add(lastMessage.senderId);
  }

  const profiles = await getProfiles([...senderIds]);
  const profileMap = new Map(profiles.map((p) => [p.id, p]));
  const messageIds = [...lastMessagesMap.values()]
    .filter((m) => m.senderId !== currentUserId)
    .map((m) => m.id);
  const readAtMap = await getReadAtByMessageIds(messageIds, currentUserId);

  for (const row of convRows) {
    const lastMessage = lastMessagesMap.get(row.id);
    if (!lastMessage || lastMessage.senderId === currentUserId) continue;

    const isRead = readAtMap.has(lastMessage.id);
    const actorName =
      row.type === "group"
        ? GROUP_ACTOR_NAME
        : getParticipantDisplayName(profileMap.get(lastMessage.senderId)?.username ?? null);

    const title = MESSAGE_NOTIFICATION_TITLE;

    messageNotifications.push({
      id: `msg-${row.id}-${lastMessage.id}`,
      kind: "message",
      contentKind: "text",
      title,
      description: `${actorName} vous a envoyé un message`,
      createdAt: lastMessage.createdAt,
      read: isRead,
      href: `/messages/${row.id}`,
      actorName,
    });
  }

  const events = await getEvents({ from: new Date().toISOString() });
  const eventNotifications = mapEventsToNotifications(events.slice(0, 10));

  const all = [...messageNotifications, ...eventNotifications];
  all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return all;
}

function mapEventsToNotifications(events: CalendarEvent[]): Notification[] {
  return events.map((event) => ({
    id: `event-${event.id}`,
    kind: "event" as const,
    title: `${EVENT_NOTIFICATION_TITLE_PREFIX} : ${event.title}`,
    description:
      event.description ??
      new Date(event.eventDate).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
    createdAt: event.createdAt,
    read: true,
    href: "/calendar",
    actorName: undefined,
  }));
}
