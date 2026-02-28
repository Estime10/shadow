"use client";

import { useState } from "react";
import useSWR from "swr";
import { MessagesHeader } from "../MessagesHeader/MessagesHeader";
import { MessagesContent } from "../MessagesContent/MessagesContent";
import { ConversationTypeChoiceModal } from "../ConversationEmptyState/ConversationTypeChoiceModal/ConversationTypeChoiceModal";
import { CreateGroupModal } from "../ConversationEmptyState/CreateGroupModal/CreateGroupModal";
import { useClientUserId, useMessagesRealtime } from "@/features/messages/hooks";
import {
  getMessagesListDataAction,
  updateUserMessageDisappearSettingAction,
} from "@/features/messages/actions";
import type { MessagesPageContent } from "@/features/messages/types";

const MESSAGES_LIST_KEY = "messages-list";

export function MessagesView(initial: MessagesPageContent) {
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [directModalOpen, setDirectModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const clientUserId = useClientUserId();

  const { data, mutate } = useSWR<MessagesPageContent>(
    MESSAGES_LIST_KEY,
    getMessagesListDataAction,
    {
      fallbackData: initial,
    }
  );
  const { conversations, currentUserId, profiles, messageDisappearAfterMinutes } = data ?? initial;
  const effectiveUserId = currentUserId ?? clientUserId;

  const conversationIds = conversations.map((c) => c.id);
  useMessagesRealtime(conversationIds, effectiveUserId);

  async function handleDisappearSettingChange(minutes: 15 | 30 | 45 | 60) {
    const result = await updateUserMessageDisappearSettingAction(minutes);
    if (result.ok) void mutate();
  }

  return (
    <>
      <MessagesHeader
        onOpenCreateConversation={() => setChoiceModalOpen(true)}
        messageDisappearAfterMinutes={messageDisappearAfterMinutes ?? 30}
        onDisappearSettingChange={handleDisappearSettingChange}
      />
      <MessagesContent
        conversations={conversations}
        currentUserId={effectiveUserId}
        profiles={profiles}
        modalOpen={directModalOpen}
        setModalOpen={setDirectModalOpen}
      />
      <ConversationTypeChoiceModal
        open={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        onSelectDirect={() => setDirectModalOpen(true)}
        onSelectGroup={() => setGroupModalOpen(true)}
      />
      <CreateGroupModal
        key={groupModalOpen ? "open" : "closed"}
        open={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        profiles={profiles}
        currentUserId={effectiveUserId}
      />
    </>
  );
}
