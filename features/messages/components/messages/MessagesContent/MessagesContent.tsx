import { MessagesList } from "../MessagesList";
import type { MessagesContentProps } from "@/features/messages/types";

export function MessagesContent({
  conversations,
  currentUserId,
  profiles,
  modalOpen,
  setModalOpen,
}: MessagesContentProps) {
  return (
    <div className="flex-1 min-h-0">
      <MessagesList
        conversations={conversations}
        currentUserId={currentUserId}
        profiles={profiles}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </div>
  );
}
