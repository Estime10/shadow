-- =============================================================================
-- 008_conversations_type_and_group.sql — Type conversation + group_id + RLS
-- À exécuter après 007_groups.sql.
-- Conversations : soit direct (user_1_id, user_2_id), soit group (group_id).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Ajout colonnes type et group_id à conversations
-- -----------------------------------------------------------------------------
alter table public.conversations
  add column if not exists "type" public.conversation_type_enum not null default 'direct'::public.conversation_type_enum;

alter table public.conversations
  add column if not exists group_id uuid references public.groups(id) on delete cascade;

-- Rendre user_1_id et user_2_id nullables (pour type = 'group')
alter table public.conversations
  alter column user_1_id drop not null,
  alter column user_2_id drop not null;

-- Contrainte : direct => user_1_id, user_2_id remplis et group_id null ; group => inverse
alter table public.conversations
  drop constraint if exists conversations_type_check;

alter table public.conversations
  add constraint conversations_type_check check (
    (type = 'direct' and user_1_id is not null and user_2_id is not null and group_id is null)
    or (type = 'group' and group_id is not null and user_1_id is null and user_2_id is null)
  );

-- Contrainte user_1 < user_2 uniquement pour direct (sinon null)
alter table public.conversations
  drop constraint if exists conversations_user_1_lt_user_2;

alter table public.conversations
  add constraint conversations_user_1_lt_user_2 check (
    type <> 'direct' or (user_1_id is not null and user_2_id is not null and user_1_id < user_2_id)
  );

alter table public.conversations
  drop constraint if exists conversations_users_different;

alter table public.conversations
  add constraint conversations_users_different check (
    type <> 'direct' or (user_1_id is not null and user_2_id is not null and user_1_id != user_2_id)
  );

-- Index unique (user_1_id, user_2_id) uniquement pour direct (partial index)
drop index if exists idx_conversations_pair;

create unique index idx_conversations_pair_direct
  on public.conversations (user_1_id, user_2_id)
  where type = 'direct';

create index if not exists idx_conversations_group_id
  on public.conversations(group_id)
  where group_id is not null;

comment on column public.conversations.type is 'direct = 1:1 (user_1_id, user_2_id) ; group = groupe (group_id)';

-- -----------------------------------------------------------------------------
-- RLS conversations : SELECT (direct OU membre du groupe)
-- -----------------------------------------------------------------------------
drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant"
  on public.conversations for select
  to authenticated
  using (
    (type = 'direct' and (user_1_id = (select auth.uid()) or user_2_id = (select auth.uid())))
    or (type = 'group' and exists (
      select 1 from public.group_members gm
      where gm.group_id = conversations.group_id and gm.user_id = (select auth.uid())
    ))
  );

-- INSERT : direct = comme avant ; group = créateur du groupe qui crée la conv (à utiliser depuis l'app)
drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
  on public.conversations for insert
  to authenticated
  with check (
    (type = 'direct' and (user_1_id = (select auth.uid()) or user_2_id = (select auth.uid())))
    or (type = 'group' and exists (
      select 1 from public.groups g
      where g.id = group_id and g.created_by_user_id = (select auth.uid())
    ))
  );

-- DELETE : direct = participant ; group = membre du groupe (ou créateur seulement, à affiner)
drop policy if exists "conversations_delete_participant" on public.conversations;
create policy "conversations_delete_participant"
  on public.conversations for delete
  to authenticated
  using (
    (type = 'direct' and (user_1_id = (select auth.uid()) or user_2_id = (select auth.uid())))
    or (type = 'group' and exists (
      select 1 from public.group_members gm
      where gm.group_id = conversations.group_id and gm.user_id = (select auth.uid())
    ))
  );

-- -----------------------------------------------------------------------------
-- RLS messages : lecture / écriture si membre de la conversation (direct OU groupe)
-- -----------------------------------------------------------------------------
drop policy if exists "messages_select_authenticated" on public.messages;
create policy "messages_select_authenticated"
  on public.messages for select
  to authenticated
  using (
    conversation_id is null
    or exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (
        (c.type = 'direct' and (c.user_1_id = (select auth.uid()) or c.user_2_id = (select auth.uid())))
        or (c.type = 'group' and exists (
          select 1 from public.group_members gm
          where gm.group_id = c.group_id and gm.user_id = (select auth.uid())
        ))
      )
    )
  );

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
  on public.messages for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and (
      conversation_id is null
      or exists (
        select 1 from public.conversations c
        where c.id = conversation_id
        and (
          (c.type = 'direct' and (c.user_1_id = (select auth.uid()) or c.user_2_id = (select auth.uid())))
          or (c.type = 'group' and exists (
            select 1 from public.group_members gm
            where gm.group_id = c.group_id and gm.user_id = (select auth.uid())
          ))
        )
      )
    )
  );

-- -----------------------------------------------------------------------------
-- RLS message_reads : INSERT si membre de la conversation (direct OU groupe)
-- (Exécuté seulement si la table message_reads existe — exécuter 005 avant 008.)
-- -----------------------------------------------------------------------------
do $outer$
begin
  if exists (select 1 from pg_tables where schemaname = 'public' and tablename = 'message_reads') then
    drop policy if exists "message_reads_insert_own_in_conv" on public.message_reads;
    execute $exec$
      create policy "message_reads_insert_own_in_conv"
        on public.message_reads for insert
        to authenticated
        with check (
          user_id = (select auth.uid())
          and exists (
            select 1 from public.messages m
            join public.conversations c on c.id = m.conversation_id
            where m.id = message_id
            and (
              (c.type = 'direct' and (c.user_1_id = (select auth.uid()) or c.user_2_id = (select auth.uid())))
              or (c.type = 'group' and exists (
                select 1 from public.group_members gm
                where gm.group_id = c.group_id and gm.user_id = (select auth.uid())
              ))
            )
          )
        )
    $exec$;
  end if;
end
$outer$;
