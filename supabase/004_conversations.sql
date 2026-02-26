-- =============================================================================
-- 004_conversations.sql — Table conversations + conversation_id sur messages
-- À exécuter après 001_schema, 002_rls, 003_indexes.
-- Une conversation = 2 users (user_1_id, user_2_id). On stocke avec user_1 < user_2
-- pour éviter les doublons (conversation A-B = conversation B-A).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table conversations (créateur + autre participant)
-- -----------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_1_id uuid not null references public.users(id) on delete cascade,
  user_2_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint conversations_user_1_lt_user_2 check (user_1_id < user_2_id),
  constraint conversations_users_different check (user_1_id != user_2_id)
);

create unique index if not exists idx_conversations_pair
  on public.conversations (user_1_id, user_2_id);

create index if not exists idx_conversations_user_1 on public.conversations(user_1_id);
create index if not exists idx_conversations_user_2 on public.conversations(user_2_id);

comment on table public.conversations is 'Conversations 1-to-1 : user_1_id < user_2_id pour unicité de la paire';

-- -----------------------------------------------------------------------------
-- Ajouter conversation_id à messages (nullable pour migration, puis NOT NULL)
-- -----------------------------------------------------------------------------
alter table public.messages
  add column if not exists conversation_id uuid references public.conversations(id) on delete cascade;

create index if not exists idx_messages_conversation_id on public.messages(conversation_id);
create index if not exists idx_messages_conversation_created
  on public.messages(conversation_id, created_at desc);

-- -----------------------------------------------------------------------------
-- RLS conversations
-- -----------------------------------------------------------------------------
alter table public.conversations enable row level security;

drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant"
  on public.conversations for select
  to authenticated
  using (
    user_1_id = (select auth.uid())
    or user_2_id = (select auth.uid())
  );

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
  on public.conversations for insert
  to authenticated
  with check (
    user_1_id = (select auth.uid()) or user_2_id = (select auth.uid())
  );

drop policy if exists "conversations_delete_participant" on public.conversations;
create policy "conversations_delete_participant"
  on public.conversations for delete
  to authenticated
  using (
    user_1_id = (select auth.uid()) or user_2_id = (select auth.uid())
  );

-- Messages : lecture si je suis dans la conversation
drop policy if exists "messages_select_authenticated" on public.messages;
create policy "messages_select_authenticated"
  on public.messages for select
  to authenticated
  using (
    conversation_id is null
    or exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
      and (c.user_1_id = (select auth.uid()) or c.user_2_id = (select auth.uid()))
    )
  );

-- Messages : insertion si je suis l'expéditeur et (pas de conversation ou je suis dans la conversation)
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
        and (c.user_1_id = (select auth.uid()) or c.user_2_id = (select auth.uid()))
      )
    )
  );

-- Messages : mise à jour de son propre message
drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own"
  on public.messages for update
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
