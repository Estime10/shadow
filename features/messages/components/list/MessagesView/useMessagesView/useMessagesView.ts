"use client";

import { useState } from "react";
import useSWR from "swr";
import { useClientUserId, useMessagesRealtime } from "@/lib/hooks/messages";
import {
  getMessagesListDataAction,
  updateUserMessageDisappearSettingAction,
} from "@/features/messages/actions";
import type { MessagesPageContent } from "@/features/messages/types";

const MESSAGES_LIST_KEY = "messages-list";

export function useMessagesView(initial: MessagesPageContent) {
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [directModalOpen, setDirectModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const clientUserId = useClientUserId();

  const { data, mutate } = useSWR<MessagesPageContent>(
    MESSAGES_LIST_KEY,
    getMessagesListDataAction,
    { fallbackData: initial }
  );

  const { conversations, currentUserId, profiles, messageDisappearAfterMinutes } = data ?? initial;
  const effectiveUserId = currentUserId ?? clientUserId;
  const conversationIds = conversations.map((c) => c.id);

  useMessagesRealtime(conversationIds, effectiveUserId);

  async function handleDisappearSettingChange(minutes: 15 | 30 | 45 | 60) {
    const result = await updateUserMessageDisappearSettingAction(minutes);
    if (result.ok) void mutate();
  }

  return {
    choiceModalOpen,
    setChoiceModalOpen,
    directModalOpen,
    setDirectModalOpen,
    groupModalOpen,
    setGroupModalOpen,
    conversations,
    effectiveUserId,
    profiles,
    messageDisappearAfterMinutes: messageDisappearAfterMinutes ?? 30,
    handleDisappearSettingChange,
  };
}
