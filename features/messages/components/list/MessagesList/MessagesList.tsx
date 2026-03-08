"use client";

import { ConversationListItem } from "../ConversationListItem/ConversationListItem";
import { ConversationEmptyState } from "../ConversationEmptyState/ConversationEmptyState";
import { ConversationsEmptyCard } from "./ConversationsEmptyCard/ConversationsEmptyCard";
import type { MessagesContentProps } from "@/features/messages/types";

export function MessagesList({
  conversations,
  currentUserId,
  profiles,
  modalOpen,
  setModalOpen,
  onOpenCreateConversation,
}: MessagesContentProps) {
  const handleOpenCreate = onOpenCreateConversation ?? (() => setModalOpen(true));
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 content-px overflow-x-hidden lg:flex-row">
      <aside className="flex min-w-0 flex-1 flex-col overflow-x-hidden lg:max-w-sm lg:rounded-r-xl min-h-0">
        <div className="shrink-0 content-px py-3">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-(--text-muted)">
            Conversations
          </h2>
        </div>
        <div className="flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto content-px pb-2">
          {conversations.length === 0 ? (
            <ConversationsEmptyCard onOpenCreateConversation={handleOpenCreate} />
          ) : (
            conversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                currentUserId={currentUserId}
                profiles={profiles}
              />
            ))
          )}
        </div>
      </aside>

      <ConversationEmptyState
        profiles={profiles}
        currentUserId={currentUserId}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        hidePanel
      />
    </div>
  );
}
