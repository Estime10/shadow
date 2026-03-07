"use client";

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { SWRConfig, type SWRConfiguration } from "swr";
import { useMessagesRealtime } from "@/lib/hooks/messages/useMessagesRealtime/useMessagesRealtime";

const MESSAGES_LIST_KEY = "messages-list";

type StoredCallback = (payload: { new?: unknown; old?: unknown }) => void;
const callbacks: Record<string, StoredCallback> = {};

const mockChannel = {
  on: vi.fn(
    (
      _event: string,
      filter: { event: string; schema: string; table: string },
      cb: StoredCallback
    ) => {
      const key = `${filter.event}-${filter.table}`;
      callbacks[key] = cb;
      return mockChannel;
    }
  ),
  subscribe: vi.fn(),
};

const mockGetSession = vi.fn().mockResolvedValue({
  data: { session: { access_token: "test-token" } },
  error: null,
});

const mockSetAuth = vi.fn();
const mockRemoveChannel = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    realtime: { setAuth: mockSetAuth },
    channel: () => mockChannel,
    removeChannel: mockRemoveChannel,
  }),
}));

function TestWrapper({
  conversationIds,
  currentUserId,
  threadCacheKey,
}: {
  conversationIds: string[];
  currentUserId: string | null;
  threadCacheKey?: readonly [string, string, string?] | null;
}) {
  useMessagesRealtime(conversationIds, currentUserId, {
    threadCacheKey: threadCacheKey ?? undefined,
  });
  return <div data-testid="realtime-mounted">ok</div>;
}

describe("useMessagesRealtime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(callbacks).forEach((k) => delete callbacks[k]);
  });

  it("s'abonne au channel et appelle mutate(messages-list) sur INSERT message", async () => {
    const mutate = vi.fn();
    render(
      <SWRConfig value={{ mutate } as SWRConfiguration}>
        <TestWrapper conversationIds={["conv-1"]} currentUserId="user-1" />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    const cb = callbacks["INSERT-messages"];
    expect(cb).toBeDefined();
    cb({
      new: {
        id: "msg-1",
        user_id: "user-2",
        conversation_id: "conv-1",
        text: "Hello",
        created_at: "2025-01-01T12:00:00Z",
      },
    });

    expect(mutate).toHaveBeenCalledWith(MESSAGES_LIST_KEY);
  });

  it("met à jour le cache thread sur INSERT message quand threadCacheKey correspond", async () => {
    const mutate = vi.fn();
    const threadCacheKey: readonly [string, string] = ["messages", "conv-1"];

    render(
      <SWRConfig value={{ mutate } as SWRConfiguration}>
        <TestWrapper
          conversationIds={["conv-1"]}
          currentUserId="user-1"
          threadCacheKey={threadCacheKey}
        />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    const cb = callbacks["INSERT-messages"];
    expect(cb).toBeDefined();
    cb({
      new: {
        id: "msg-new",
        user_id: "user-2",
        conversation_id: "conv-1",
        text: "New message",
        created_at: "2025-01-01T13:00:00Z",
      },
    });

    expect(mutate).toHaveBeenCalledWith(MESSAGES_LIST_KEY);
    const threadCall = (mutate as ReturnType<typeof vi.fn>).mock.calls.find(
      (c: unknown[]) => Array.isArray(c[0]) && c[0][1] === "conv-1"
    );
    expect(threadCall).toBeDefined();
    const updater = threadCall![1];
    const prev = {
      conversation: { id: "conv-1" } as const,
      messages: [
        { id: "m0", text: "Existing", senderId: "u1", conversationId: "conv-1", createdAt: "" },
      ],
      currentUserId: "user-1",
      readMessageIds: [],
    };
    const next = updater(prev);
    expect(next?.messages).toHaveLength(2);
    expect(next?.messages[1].id).toBe("msg-new");
    expect(next?.messages[1].text).toBe("New message");
  });

  it("met à jour le cache thread sur DELETE message (filtre par id)", async () => {
    const mutate = vi.fn();
    const threadCacheKey: readonly [string, string] = ["messages", "conv-1"];

    render(
      <SWRConfig value={{ mutate } as SWRConfiguration}>
        <TestWrapper
          conversationIds={["conv-1"]}
          currentUserId="user-1"
          threadCacheKey={threadCacheKey}
        />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    const cb = callbacks["DELETE-messages"];
    expect(cb).toBeDefined();
    cb({
      old: {
        id: "msg-to-delete",
        conversation_id: "conv-1",
      },
    });

    const threadCall = (mutate as ReturnType<typeof vi.fn>).mock.calls.find(
      (c: unknown[]) => Array.isArray(c[0]) && c[0][1] === "conv-1"
    );
    expect(threadCall).toBeDefined();
    const updater = threadCall![1];
    const prev = {
      conversation: { id: "conv-1" } as const,
      messages: [
        { id: "m0", text: "Keep", senderId: "u1", conversationId: "conv-1", createdAt: "" },
        {
          id: "msg-to-delete",
          text: "Remove",
          senderId: "u2",
          conversationId: "conv-1",
          createdAt: "",
        },
      ],
      currentUserId: "user-1",
      readMessageIds: [],
    };
    const next = updater(prev);
    expect(next?.messages).toHaveLength(1);
    expect(next?.messages[0].id).toBe("m0");
  });

  it("met à jour le cache thread sur UPDATE message (remplace par id)", async () => {
    const mutate = vi.fn();
    const threadCacheKey: readonly [string, string] = ["messages", "conv-1"];

    render(
      <SWRConfig value={{ mutate } as SWRConfiguration}>
        <TestWrapper
          conversationIds={["conv-1"]}
          currentUserId="user-1"
          threadCacheKey={threadCacheKey}
        />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    const cb = callbacks["UPDATE-messages"];
    expect(cb).toBeDefined();
    cb({
      new: {
        id: "msg-edit",
        user_id: "user-1",
        conversation_id: "conv-1",
        text: "Edited text",
        created_at: "2025-01-01T12:00:00Z",
      },
    });

    const threadCall = (mutate as ReturnType<typeof vi.fn>).mock.calls.find(
      (c: unknown[]) => Array.isArray(c[0]) && c[0][1] === "conv-1"
    );
    expect(threadCall).toBeDefined();
    const updater = threadCall![1];
    const prev = {
      conversation: { id: "conv-1" } as const,
      messages: [
        {
          id: "msg-edit",
          text: "Original",
          senderId: "user-1",
          conversationId: "conv-1",
          createdAt: "2025-01-01T12:00:00Z",
        },
      ],
      currentUserId: "user-1",
      readMessageIds: [],
    };
    const next = updater(prev);
    expect(next?.messages).toHaveLength(1);
    expect(next?.messages[0].text).toBe("Edited text");
  });

  it("appelle revalidateList sur INSERT conversation si la conversation est pour currentUserId", async () => {
    const mutate = vi.fn();
    render(
      <SWRConfig value={{ mutate } as SWRConfiguration}>
        <TestWrapper conversationIds={[]} currentUserId="user-1" />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    const cb = callbacks["INSERT-conversations"];
    expect(cb).toBeDefined();
    cb({
      new: { user_1_id: "user-1", user_2_id: "user-2" },
    });

    expect(mutate).toHaveBeenCalledWith(MESSAGES_LIST_KEY);
  });

  it("n'appelle pas revalidateList sur INSERT conversation si currentUserId n'est pas participant", async () => {
    const mutate = vi.fn();
    render(
      <SWRConfig value={{ mutate } as SWRConfiguration}>
        <TestWrapper conversationIds={[]} currentUserId="user-1" />
      </SWRConfig>
    );

    await waitFor(() => {
      expect(mockChannel.subscribe).toHaveBeenCalled();
    });

    const cb = callbacks["INSERT-conversations"];
    cb({
      new: { user_1_id: "user-3", user_2_id: "user-2" },
    });

    expect(mutate).not.toHaveBeenCalled();
  });
});
