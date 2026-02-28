"use client";

import { MessagesHeader } from "../MessagesHeader/MessagesHeader";
import { MessagesContent } from "../MessagesContent/MessagesContent";
import { ConversationTypeChoiceModal } from "../ConversationEmptyState/ConversationTypeChoiceModal/ConversationTypeChoiceModal";
import { CreateGroupModal } from "../ConversationEmptyState/CreateGroupModal/CreateGroupModal";
import { useMessagesView } from "./useMessagesView/useMessagesView";
import type { MessagesPageContent } from "@/features/messages/types";

export function MessagesView(initial: MessagesPageContent) {
  const {
    choiceModalOpen,
    setChoiceModalOpen,
    directModalOpen,
    setDirectModalOpen,
    groupModalOpen,
    setGroupModalOpen,
    conversations,
    effectiveUserId,
    profiles,
    messageDisappearAfterMinutes,
    handleDisappearSettingChange,
  } = useMessagesView(initial);

  return (
    <>
      <MessagesHeader
        onOpenCreateConversation={() => setChoiceModalOpen(true)}
        messageDisappearAfterMinutes={messageDisappearAfterMinutes}
        onDisappearSettingChange={handleDisappearSettingChange}
      />
      <MessagesContent
        conversations={conversations}
        currentUserId={effectiveUserId}
        profiles={profiles}
        modalOpen={directModalOpen}
        setModalOpen={setDirectModalOpen}
        onOpenCreateConversation={() => setChoiceModalOpen(true)}
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
