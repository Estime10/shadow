/**
 * Point d'entrée central pour Supabase : profils, messages, etc.
 * Importer depuis ici pour les hooks et composants.
 */

export { getCurrentUserProfile } from "./profiles/getCurrentUserProfile/getCurrentUserProfile";
export { getProfiles, getAllProfiles } from "./profiles/getProfiles/getProfiles";
export { updateUserMessageDisappearSetting } from "./profiles/updateUserMessageDisappearSetting/updateUserMessageDisappearSetting";
export { MESSAGE_DISAPPEAR_MINUTES_OPTIONS } from "./profiles/types/types";
export type {
  CurrentUserProfile,
  Profile,
  ProfileRow,
  MessageDisappearAfterMinutes,
} from "./profiles/types/types";

export { insertMessageRead } from "./messageReads/insertMessageRead/insertMessageRead";
export { insertMessageReadBatch } from "./messageReads/insertMessageReadBatch/insertMessageReadBatch";
export { getReadAtByMessageIds } from "./messageReads/getReadAtByMessageIds/getReadAtByMessageIds";
export type { MessageReadRow } from "./messageReads/types/types";

export { deleteConversation } from "./conversations/deleteConversation/deleteConversation";
export { findOrCreateConversation } from "./conversations/findOrCreateConversation/findOrCreateConversation";
export { createGroupConversation } from "./conversations/createGroupConversation/createGroupConversation";
export { getConversationById } from "./conversations/getConversationById/getConversationById";
export { getConversationsByIds } from "./conversations/getConversationsByIds/getConversationsByIds";
export { getConversationsForUser } from "./conversations/getConversationsForUser/getConversationsForUser";
export type { ConversationRow } from "./conversations/types/types";
export { getGroupById } from "./groups/getGroupById/getGroupById";
export { getGroupMemberIds } from "./groups/getGroupMemberIds/getGroupMemberIds";
export type { GroupRow } from "./groups/getGroupById/getGroupById";

export { getMessages } from "./messages/getMessages/getMessages";
export type { GetMessagesVisibilityOptions } from "./messages/getMessages/getMessages";
export { getLastMessagesForConversations } from "./messages/getLastMessagesForConversations/getLastMessagesForConversations";
export { createMessage } from "./messages/createMessage/createMessage";
export { updateMessage } from "./messages/updateMessage/updateMessage";
export { deleteMessage } from "./messages/deleteMessage/deleteMessage";
export { mapMessageRowToMessage } from "./messages/mappers/mappers";
export { ROOM_CONVERSATION_ID } from "./messages/types/types";
export type { MessageRow } from "./messages/types/types";

export { getConversationIdsForCurrentUser, getUnreadCountForCurrentUser } from "./notifications";
export { getEvents } from "./events/getEvents/getEvents";
export { getUpcomingEventsCount } from "./events/getUpcomingEventsCount/getUpcomingEventsCount";
export { createEvent } from "./events/createEvent/createEvent";
export { updateEvent } from "./events/updateEvent/updateEvent";
export { deleteEvent } from "./events/deleteEvent/deleteEvent";
export type { CreateEventParams } from "./events/createEvent/createEvent";
export type { UpdateEventParams } from "./events/updateEvent/updateEvent";
export type { EventRow } from "./events/types/types";
