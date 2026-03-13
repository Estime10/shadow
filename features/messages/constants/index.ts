/**
 * Constantes partagées pour la feature messages.
 * Évite la duplication (DRY) et garantit des libellés cohérents.
 */

export const FALLBACK_PARTICIPANT_NAME = "Ghost";
export const FALLBACK_USERNAME = "Sans pseudo";
export const EMPTY_LAST_MESSAGE_TEXT = "Aucun message";

/** Id de la conversation "room" (une seule pour tout le monde). Doit correspondre à lib/supabase/CRUD. */
export const ROOM_CONVERSATION_ID = "room";

/** Nom affiché pour la conversation "room" (une seule pour tout le monde, pas de 1:1). */
export const ROOM_DISPLAY_NAME = "Messages";

/** Limite max caractères par message (côté serveur + client). */
export const MAX_MESSAGE_LENGTH = 65_536;
/** Au-delà de ce nombre de caractères, afficher "Voir plus" (style WhatsApp). */
export const MESSAGE_TRUNCATE_THRESHOLD = 200;

/** Clé SWR pour la liste des conversations / messages (invalidation après envoi, suppression, etc.). */
export const MESSAGES_LIST_KEY = "messages-list";

/** Types MIME acceptés pour la pièce jointe image dans l'input message. */
export const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif";

/** Types MIME acceptés pour la vidéo (miniature = première frame). */
export const ACCEPT_VIDEO = "video/mp4,video/webm";

/** Image + vidéo pour la modale d’envoi de média. */
export const ACCEPT_MEDIA = `${ACCEPT_IMAGES},${ACCEPT_VIDEO}`;
