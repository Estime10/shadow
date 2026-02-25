"use client";

import { ConversationListItem } from "../ConversationListItem/ConversationListItem";
import { ConversationEmptyState } from "../ConversationEmptyState";
import { ConversationsEmptyCard } from "./ConversationsEmptyCard/ConversationsEmptyCard";
import type { MessagesListProps } from "@/features/messages/types";

export function MessagesList({
  conversations,
  currentUserId,
  profiles,
  modalOpen,
  setModalOpen,
}: MessagesListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 content-px lg:flex-row">
      <aside className="flex flex-1 flex-col bg-surface lg:max-w-sm lg:rounded-r-xl min-h-0">
        <div className="shrink-0 content-px py-3">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-(--text-muted)">
            Conversations
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto content-px pb-2">
          {conversations.length === 0 ? (
            <ConversationsEmptyCard onOpenCreateConversation={() => setModalOpen(true)} />
          ) : (
            conversations.map((conv) => (
              <ConversationListItem
                key={conv.id}
                conversation={conv}
                isSelected={false}
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
        hidePanel={conversations.length === 0}
      />
    </div>
  );
}
