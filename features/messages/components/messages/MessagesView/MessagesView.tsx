"use client";

import { useState } from "react";
import { MessagesHeader } from "../MessagesHeader/MessagesHeader";
import { MessagesContent } from "../MessagesContent/MessagesContent";
import type { MessagesListProps } from "../../../types/props";

export function MessagesView({
  conversations,
  currentUserId,
  profiles,
}: Omit<MessagesListProps, "modalOpen" | "setModalOpen">) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <MessagesHeader onOpenCreateConversation={() => setModalOpen(true)} />
      <MessagesContent
        conversations={conversations}
        currentUserId={currentUserId}
        profiles={profiles}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </>
  );
}
