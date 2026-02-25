import { MessageThread } from "../MessageThread/MessageThread";
import type { MessageIdContentProps } from "@/features/messages/types";

export function MessageIdContent({ conversation, messages, currentUserId }: MessageIdContentProps) {
  return (
    <div className="flex-1 min-h-0">
      <MessageThread
        conversation={conversation}
        messages={messages}
        currentUserId={currentUserId}
        showHeader={false}
      />
    </div>
  );
}
