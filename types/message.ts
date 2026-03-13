/** Type de média d'un message (Storage + affichage). */
export type MessageMediaType = "image" | "video";

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
  /** Chemin Storage (bucket media) ou null. */
  mediaUrl?: string | null;
  /** Présent si mediaUrl est renseigné. */
  mediaType?: MessageMediaType | null;
  /** true si l'utilisateur courant a déjà ouvert le média (message_media_views). */
  mediaViewedByMe?: boolean;
};

export type Conversation = {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  lastMessage: {
    text: string;
    createdAt: string;
    senderId: string;
  };
  unreadCount: number;
};
