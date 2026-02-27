"use client";

import { useState } from "react";
import useSWR from "swr";
import { MessagesHeader } from "../MessagesHeader/MessagesHeader";
import { MessagesContent } from "../MessagesContent/MessagesContent";
import { useClientUserId, useMessagesRealtime } from "@/features/messages/hooks";
import { getMessagesListDataAction } from "@/features/messages/actions";
import type { MessagesPageContent } from "@/features/messages/types";

const MESSAGES_LIST_KEY = "messages-list";

export function MessagesView(initial: MessagesPageContent) {
  const [modalOpen, setModalOpen] = useState(false);
  const clientUserId = useClientUserId();

  const { data } = useSWR<MessagesPageContent>(MESSAGES_LIST_KEY, getMessagesListDataAction, {
    fallbackData: initial,
  });
  const { conversations, currentUserId, profiles } = data ?? initial;
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
