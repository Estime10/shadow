-- =============================================================================
-- 010_message_reads_select_conversation.sql — RLS message_reads : voir les "lu" de l'autre
-- À exécuter après 005_message_reads.sql.
-- Pour afficher "Lu" côté expéditeur : il doit pouvoir lire les message_reads
-- où user_id = l'autre participant (pas seulement les siens).
-- =============================================================================

-- Remplacer la policy SELECT : autoriser la lecture des lignes pour les messages
-- des conversations dont je suis participant (direct ou groupe ; donc je peux voir mes "lu" et ceux des autres).
-- Sans la branche groupe, getReadAtByMessageIds ne voyait pas nos message_reads pour les groupes → badge restait bloqué.
drop policy if exists "message_reads_select_own" on public.message_reads;
drop policy if exists "message_reads_select_conversation" on public.message_reads;
create policy "message_reads_select_conversation"
  on public.message_reads for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      left join public.conversations c on c.id = m.conversation_id
      where m.id = message_reads.message_id
      and (
        m.conversation_id is null
        or c.user_1_id = (select auth.uid())
        or c.user_2_id = (select auth.uid())
        or (
          c.type = 'group'
          and c.group_id is not null
          and exists (
            select 1 from public.group_members gm
            where gm.group_id = c.group_id and gm.user_id = (select auth.uid())
          )
        )
      )
    )
  );
