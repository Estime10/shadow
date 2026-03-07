import { FALLBACK_USERNAME } from "@/features/messages/constants";

export function getLastMessageSenderLabel(
  senderId: string,
  currentUserId: string | null,
  profiles: { id: string; username: string | null }[]
): string {
  if (currentUserId != null && senderId === currentUserId) return "moi: ";
  const sender = profiles.find((p) => p.id === senderId);
  const name = sender?.username?.trim() ?? FALLBACK_USERNAME;
  return `${name}: `;
}
