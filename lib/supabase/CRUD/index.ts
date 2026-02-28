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
export { getConversationById } from "./conversations/getConversationById/getConversationById";
export { getConversationsForUser } from "./conversations/getConversationsForUser/getConversationsForUser";
export type { ConversationRow } from "./conversations/types/types";

export { getMessages } from "./messages/getMessages/getMessages";
export type { GetMessagesVisibilityOptions } from "./messages/getMessages/getMessages";
export { getLastMessagesForConversations } from "./messages/getLastMessagesForConversations/getLastMessagesForConversations";
export { createMessage } from "./messages/createMessage/createMessage";
export { updateMessage } from "./messages/updateMessage/updateMessage";
export { deleteMessage } from "./messages/deleteMessage/deleteMessage";
export { mapMessageRowToMessage } from "./messages/mappers/mappers";
export { ROOM_CONVERSATION_ID } from "./messages/types/types";
export type { MessageRow } from "./messages/types/types";
