/**
 * Constantes partagées pour la feature messages.
 * Évite la duplication (DRY) et garantit des libellés cohérents.
 */

export const FALLBACK_PARTICIPANT_NAME = "Ghost";
export const FALLBACK_USERNAME = "Sans pseudo";
export const EMPTY_LAST_MESSAGE_TEXT = "Aucun message";

/** Nom affiché pour la conversation "room" (une seule pour tout le monde, pas de 1:1). */
export const ROOM_DISPLAY_NAME = "Messages";

/** Limite max caractères par message (côté serveur + client). */
export const MAX_MESSAGE_LENGTH = 65_536;
/** Au-delà de ce nombre de caractères, afficher "Voir plus" (style WhatsApp). */
export const MESSAGE_TRUNCATE_THRESHOLD = 200;
