import { MessageBubble } from "../MessageBubble/MessageBubble";
import { MessageInput } from "../MessageInput/MessageInput";
import type { MessageThreadProps } from "../../../types/props";

export function MessageThread({
  conversation,
  messages,
  currentUserId,
  showHeader = true,
}: MessageThreadProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-(--bg)">
      {showHeader ? (
        <div className="flex shrink-0 items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-(--border) bg-(--bg) font-display text-xs font-bold uppercase text-accent">
            {conversation.participant.name.slice(0, 1).toUpperCase()}
          </span>
          <span className="font-display text-sm font-bold uppercase tracking-wider text-(--text)">
            {conversation.participant.name}
          </span>
          <span className="text-xs text-(--text-muted)">· 24h</span>
        </div>
      ) : null}

      <div
        className="flex-1 space-y-3 overflow-y-auto p-4"
        style={{ paddingBottom: "calc(9rem + env(safe-area-inset-bottom, 0px))" }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center py-12">
            <p className="font-display text-sm font-medium uppercase tracking-wider text-(--text-muted)">
              Aucun message
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUserId={currentUserId} />
          ))
        )}
      </div>

      <MessageInput conversationId={conversation.id} />
    </div>
  );
}
