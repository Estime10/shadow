import { createClient } from "../../../server";

/**
 * Trouve ou crée une conversation entre currentUser et otherUserId.
 * On stocke user_1_id < user_2_id pour unicité.
 */
export async function findOrCreateConversation(
  otherUserId: string
): Promise<{ conversationId: string; error: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { conversationId: "", error: "Non authentifié" };
  }

  const myId = user.id;
  if (otherUserId === myId) {
    return { conversationId: "", error: "Impossible de créer une conversation avec soi-même" };
  }

  const [user1, user2] = myId < otherUserId ? [myId, otherUserId] : [otherUserId, myId];

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("user_1_id", user1)
    .eq("user_2_id", user2)
    .maybeSingle();

  if (existing) {
    return { conversationId: existing.id, error: null };
  }

  const { data: inserted, error } = await supabase
    .from("conversations")
    .insert({
      type: "direct",
      user_1_id: user1,
      user_2_id: user2,
    })
    .select("id")
    .single();

  if (error) return { conversationId: "", error: error.message };
  return { conversationId: inserted.id, error: null };
}
