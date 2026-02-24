"use client";

import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { FAKE_CONVERSATIONS, FAKE_MESSAGES } from "./fakeData";
import { ConversationListItem } from "./ConversationListItem";
import { MessageThread } from "./MessageThread";

export function MessengerView() {
  const [selectedId, setSelectedId] = useState<string | null>(
    FAKE_CONVERSATIONS[0]?.id ?? null
  );

  const selectedConversation = FAKE_CONVERSATIONS.find((c) => c.id === selectedId);
  const messages = selectedId ? FAKE_MESSAGES[selectedId] ?? [] : [];

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      {/* Liste des conversations */}
      <aside
        className={`flex shrink-0 flex-col bg-[var(--surface)] lg:w-80 min-h-0 ${
          selectedId ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="shrink-0 px-4 py-3">
          <h2 className="font-display text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
            Conversations
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {FAKE_CONVERSATIONS.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conversation={conv}
              isSelected={selectedId === conv.id}
              onSelect={() => setSelectedId(conv.id)}
            />
          ))}
        </div>
      </aside>

      {/* Thread ou placeholder */}
      <div className="flex min-h-0 flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Back mobile */}
            <div className="flex shrink-0 items-center bg-[var(--surface)] px-4 py-2 lg:hidden">
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 text-[var(--accent)] transition-opacity hover:opacity-80"
                aria-label="Retour à la liste"
              >
                <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden />
                <span className="font-display text-xs font-bold uppercase tracking-wider">
                  Retour
                </span>
              </button>
            </div>
            <MessageThread
              conversation={selectedConversation}
              messages={messages}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--bg)] p-8 lg:flex">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface)]">
              <MessageCircle className="h-8 w-8 text-[var(--text-muted)]" aria-hidden />
            </div>
            <p className="text-center font-display text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
              Choisis une conversation
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
