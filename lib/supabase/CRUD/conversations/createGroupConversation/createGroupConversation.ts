import { createClient } from "../../../server";
import { requireUser } from "../../../requireUser";

const DEFAULT_GROUP_NAME = "Groupe";

/**
 * Crée un groupe de discussion et la conversation associée.
 * 1. Insert groups (créateur = utilisateur courant)
 * 2. Insert group_members (créateur + participantIds, sans doublon)
 * 3. Insert conversations (type = 'group', group_id)
 */
export async function createGroupConversation(
  participantIds: string[],
  groupName?: string
): Promise<{ conversationId: string; error: string | null }> {
  const supabase = await createClient();
  const auth = await requireUser(supabase);
  if ("error" in auth) return { conversationId: "", error: auth.error };
  const { user } = auth;
  const creatorId = user.id;
  const memberIds = new Set<string>([creatorId, ...participantIds]);

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: groupName ?? DEFAULT_GROUP_NAME,
      created_by_user_id: creatorId,
    })
    .select("id")
    .single();

  if (groupError || !group) {
    return { conversationId: "", error: groupError?.message ?? "Impossible de créer le groupe" };
  }

  const { error: membersError } = await supabase.from("group_members").insert(
    Array.from(memberIds).map((user_id) => ({
      group_id: group.id,
      user_id,
    }))
  );

  if (membersError) {
    return { conversationId: "", error: membersError.message };
  }

  const { data: conversation, error: convError } = await supabase
    .from("conversations")
    .insert({
      type: "group",
      group_id: group.id,
      user_1_id: null,
      user_2_id: null,
    })
    .select("id")
    .single();

  if (convError || !conversation) {
    return {
      conversationId: "",
      error: convError?.message ?? "Impossible de créer la conversation",
    };
  }

  return { conversationId: conversation.id, error: null };
}
