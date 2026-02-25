-- =============================================================================
-- 002_rls.sql — Row Level Security (RLS)
-- À exécuter après 001_schema.sql dans le SQL Editor du dashboard Supabase.
-- =============================================================================

-- Activer RLS sur toutes les tables publiques
alter table public.users enable row level security;
alter table public.messages enable row level security;
alter table public.events enable row level security;

-- =============================================================================
-- public.users
-- =============================================================================

-- Tout le monde (authentifié) peut lire les profils (pour afficher qui envoie un message, etc.)
create policy "users_select_authenticated"
  on public.users for select
  to authenticated
  using (true);

-- Un utilisateur ne peut insérer que sa propre ligne (géré par le trigger en pratique)
create policy "users_insert_own"
  on public.users for insert
  to authenticated
  with check (id = auth.uid());

-- Un utilisateur ne peut modifier que son propre profil
create policy "users_update_own"
  on public.users for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Pas de delete utilisateur depuis l'app (suppression via auth.users gère le cascade)
-- Si tu veux permettre "supprimer mon compte" : policy delete pour id = auth.uid()

-- =============================================================================
-- public.messages
-- =============================================================================

-- Tous les utilisateurs authentifiés peuvent lire les messages (non expirés géré côté app ou policy)
create policy "messages_select_authenticated"
  on public.messages for select
  to authenticated
  using (true);

-- Seul l'utilisateur connecté peut insérer un message avec son propre user_id
create policy "messages_insert_own"
  on public.messages for insert
  to authenticated
  with check (user_id = auth.uid());

-- Optionnel : autoriser la suppression de ses propres messages (ex. "retirer pour tous")
-- create policy "messages_delete_own" on public.messages for delete to authenticated using (user_id = auth.uid());

-- =============================================================================
-- public.events
-- =============================================================================

-- Tous les utilisateurs authentifiés peuvent lire les événements
create policy "events_select_authenticated"
  on public.events for select
  to authenticated
  using (true);

-- Seul l'utilisateur connecté peut créer un événement (created_by = lui)
create policy "events_insert_authenticated"
  on public.events for insert
  to authenticated
  with check (created_by = auth.uid());

-- Un utilisateur peut modifier uniquement les événements qu'il a créés
create policy "events_update_own"
  on public.events for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

-- Un utilisateur peut supprimer uniquement les événements qu'il a créés
create policy "events_delete_own"
  on public.events for delete
  to authenticated
  using (created_by = auth.uid());
