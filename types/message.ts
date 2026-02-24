export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
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
