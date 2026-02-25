"use client";

import { useState } from "react";
import { MessagesHeader } from "../MessagesHeader/MessagesHeader";
import { MessagesContent } from "../MessagesContent/MessagesContent";
import type { MessagesViewProps } from "@/features/messages/types";

export function MessagesView({ conversations, currentUserId, profiles }: MessagesViewProps) {
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
