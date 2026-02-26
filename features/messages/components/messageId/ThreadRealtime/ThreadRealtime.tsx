"use client";

import { useMessagesRealtime } from "@/features/messages/hooks";

type ThreadRealtimeProps = {
  conversationId: string;
};

/**
 * S'abonne aux nouveaux messages de cette conversation et déclenche un refresh du thread.
 * Rendu invisible (pas d'UI).
 */
export function ThreadRealtime({ conversationId }: ThreadRealtimeProps) {
  useMessagesRealtime([conversationId]);
  return null;
}
