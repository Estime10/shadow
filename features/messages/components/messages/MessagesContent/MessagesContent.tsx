import { MessagesList } from "../MessagesList";
import type { MessagesListProps } from "../../../types/props";

export function MessagesContent({
  conversations,
  currentUserId,
  profiles,
  modalOpen,
  setModalOpen,
}: MessagesListProps) {
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
