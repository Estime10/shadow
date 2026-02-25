"use client";

import { Fragment } from "react";
import { ConversationListItem } from "../ConversationListItem/ConversationListItem";
import { ConversationEmptyState } from "../ConversationEmptyState";
import { ConversationsEmptyCard } from "./ConversationsEmptyCard/ConversationsEmptyCard";
import type { MessagesContentProps } from "@/features/messages/types";

export function MessagesList({
  conversations,
  currentUserId,
  profiles,
  modalOpen,
  setModalOpen,
}: MessagesContentProps) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 content-px overflow-x-hidden lg:flex-row">
      <aside className="flex min-w-0 flex-1 flex-col overflow-x-hidden bg-surface lg:max-w-sm lg:rounded-r-xl min-h-0">
        <div className="shrink-0 content-px py-3">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-(--text-muted)">
            Conversations
          </h2>
        </div>
        <div className="flex-1 overflow-x-hidden overflow-y-auto content-px pb-2">
          {conversations.length === 0 ? (
            <ConversationsEmptyCard onOpenCreateConversation={() => setModalOpen(true)} />
          ) : (
            conversations.map((conv, i) => (
              <Fragment key={conv.id}>
                <ConversationListItem
                  conversation={conv}
                  isSelected={false}
                  currentUserId={currentUserId}
                  profiles={profiles}
                />
                {i < conversations.length - 1 ? (
                  <div className="h-px w-full shrink-0 bg-(--border)" aria-hidden />
                ) : null}
              </Fragment>
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
