"use client";

import { useState } from "react";
import { MessagesHeader } from "../MessagesHeader/MessagesHeader";
import { MessagesContent } from "../MessagesContent/MessagesContent";
import { useClientUserId, useMessagesRealtime } from "@/features/messages/hooks";
import type { MessagesPageContent } from "@/features/messages/types";

export function MessagesView({ conversations, currentUserId, profiles }: MessagesPageContent) {
  const [modalOpen, setModalOpen] = useState(false);
  const clientUserId = useClientUserId();
  const effectiveUserId = currentUserId ?? clientUserId;

  const conversationIds = conversations.map((c) => c.id);
  useMessagesRealtime(conversationIds, effectiveUserId);

  return (
    <>
      <MessagesHeader onOpenCreateConversation={() => setModalOpen(true)} />
      <MessagesContent
        conversations={conversations}
        currentUserId={effectiveUserId}
        profiles={profiles}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}
