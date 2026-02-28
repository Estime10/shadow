import type { ThreadCacheKey } from "@/lib/hooks/messages";
import { MessageThread } from "../MessageThread/MessageThread";
import type { MessageIdPageContent } from "@/features/messages/types";

export function MessageIdContent(
  props: MessageIdPageContent & { threadCacheKey?: ThreadCacheKey }
) {
  const { conversation, messages, currentUserId, readMessageIds, threadCacheKey } = props;
  return (
    <div className="flex-1 min-h-0">
      <MessageThread
        conversation={conversation}
        messages={messages}
        currentUserId={currentUserId}
        readMessageIds={readMessageIds ?? []}
        showHeader={false}
        threadCacheKey={threadCacheKey}
      />
    </div>
  );
}
