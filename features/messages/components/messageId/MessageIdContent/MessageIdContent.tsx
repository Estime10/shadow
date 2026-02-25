import { MessageThread } from "../MessageThread/MessageThread";
import type { MessageIdContentProps } from "../../../types/props";

export function MessageIdContent({ conversation, messages }: MessageIdContentProps) {
  return (
    <div className="flex-1 min-h-0">
      <MessageThread conversation={conversation} messages={messages} showHeader={false} />
    </div>
  );
}
