/**
 * Point d'entrée central pour Supabase : profils, messages, etc.
 * Importer depuis ici pour les hooks et composants.
 */

export { getCurrentUserProfile } from "./profiles/getCurrentUserProfile/getCurrentUserProfile";
export { getProfiles, getAllProfiles } from "./profiles/getProfiles/getProfiles";
export type { CurrentUserProfile, Profile, ProfileRow } from "./profiles/types/types";

export { deleteConversation } from "./conversations/deleteConversation/deleteConversation";
export { findOrCreateConversation } from "./conversations/findOrCreateConversation/findOrCreateConversation";
export { getConversationById } from "./conversations/getConversationById/getConversationById";
export { getConversationsForUser } from "./conversations/getConversationsForUser/getConversationsForUser";
export type { ConversationRow } from "./conversations/types/types";

export { getMessages } from "./messages/getMessages/getMessages";
export { getLastMessagesForConversations } from "./messages/getLastMessagesForConversations/getLastMessagesForConversations";
export { createMessage } from "./messages/createMessage/createMessage";
export { updateMessage } from "./messages/updateMessage/updateMessage";
export { deleteMessage } from "./messages/deleteMessage/deleteMessage";
export { mapMessageRowToMessage } from "./messages/mappers/mappers";
export { ROOM_CONVERSATION_ID } from "./messages/types/types";
export type { MessageRow } from "./messages/types/types";
