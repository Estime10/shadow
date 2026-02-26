-- =============================================================================
-- 002_rls.sql — Row Level Security (RLS)
-- À exécuter après 001_schema.sql dans le SQL Editor du dashboard Supabase.
-- Ré-exécutable : DROP IF EXISTS avant chaque CREATE.
-- =============================================================================

-- Activer RLS sur toutes les tables publiques
alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.events enable row level security;

-- =============================================================================
-- public.users
-- Les utilisateurs authentifiés peuvent lire tous les profils (pour afficher
-- les usernames dans les conversations, la modale "créer une conversation", etc.)
-- =============================================================================

drop policy if exists "users_select_authenticated" on public.users;
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

drop policy if exists "users_insert_own" on public.users;
create policy "users_insert_own"
  on public.users for insert
  to authenticated
  with check (id = (select auth.uid()));

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
  on public.users for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Pas de delete utilisateur depuis l'app (suppression via auth.users gère le cascade)
-- Si tu veux permettre "supprimer mon compte" : policy delete pour id = auth.uid()

-- =============================================================================
-- public.messages
-- =============================================================================

drop policy if exists "messages_select_authenticated" on public.messages;
create policy "messages_select_authenticated"
  on public.messages for select
  to authenticated
  using (true);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
  on public.messages for insert
  to authenticated
  with check (user_id = (select auth.uid()));

-- Suppression : seul l'auteur du message peut supprimer
drop policy if exists "messages_delete_own" on public.messages;
create policy "messages_delete_own"
  on public.messages for delete
  to authenticated
  using (user_id = (select auth.uid()));

-- =============================================================================
-- public.events
-- =============================================================================

drop policy if exists "events_select_authenticated" on public.events;
create policy "events_select_authenticated"
  on public.events for select
  to authenticated
  using (true);

drop policy if exists "events_insert_authenticated" on public.events;
create policy "events_insert_authenticated"
  on public.events for insert
  to authenticated
  with check (created_by = (select auth.uid()));

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own"
  on public.events for update
  to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own"
  on public.events for delete
  to authenticated
  using (created_by = (select auth.uid()));
