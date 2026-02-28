-- =============================================================================
-- 005_message_reads.sql — Table "messages lus" + RLS
-- À exécuter après 004_conversations.sql dans le SQL Editor du dashboard Supabase.
-- Un enregistrement = l'utilisateur user_id a lu le message message_id à read_at.
-- Utilisé pour : indicateur "Lu" en UI + disparition du message pour ce lecteur
-- après (read_at + message_disappear_after_minutes).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table message_reads
-- -----------------------------------------------------------------------------
create table if not exists public.message_reads (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  read_at timestamptz not null default now(),
  constraint message_reads_unique_per_user unique (message_id, user_id)
);

create index if not exists idx_message_reads_user_read_at
  on public.message_reads (user_id, read_at desc);

create index if not exists idx_message_reads_message_id
  on public.message_reads (message_id);

comment on table public.message_reads is 'Qui a lu quel message à quel moment ; utilisé pour "Lu" et disparition après X min pour le lecteur';

-- -----------------------------------------------------------------------------
-- RLS message_reads
-- -----------------------------------------------------------------------------
alter table public.message_reads enable row level security;

-- SELECT : uniquement ses propres lignes (user_id = moi)
drop policy if exists "message_reads_select_own" on public.message_reads;
create policy "message_reads_select_own"
  on public.message_reads for select
  to authenticated
  using (user_id = (select auth.uid()));

-- INSERT : uniquement pour soi, et seulement si j'ai le droit de voir la conversation du message
drop policy if exists "message_reads_insert_own_in_conv" on public.message_reads;
create policy "message_reads_insert_own_in_conv"
  on public.message_reads for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.messages m
      left join public.conversations c on c.id = m.conversation_id
      where m.id = message_id
      and (
        m.conversation_id is null
        or c.user_1_id = (select auth.uid())
        or c.user_2_id = (select auth.uid())
      )
    )
  );

-- Pas d'UPDATE ni DELETE : un "lu" est définitif.
