-- =============================================================================
-- events_table_and_rls.sql — Table events (calendrier) + RLS
-- À copier-coller dans le SQL Editor Supabase (ou exécuter après 001_schema si
-- vous avez déjà les tables users / messages).
-- Ré-exécutable : CREATE IF NOT EXISTS, DROP POLICY IF EXISTS avant chaque policy.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table public.events (calendrier partagé)
-- -----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.events is 'Événements du calendrier partagé';
comment on column public.events.created_by is 'Utilisateur créateur (auth.uid() à l’insert)';

-- Index pour filtres par créateur et par date
create index if not exists idx_events_created_by on public.events(created_by);
create index if not exists idx_events_event_date on public.events(event_date);

-- -----------------------------------------------------------------------------
-- RLS : lecture pour tous les authentifiés, écriture (update/delete) pour le créateur uniquement
-- -----------------------------------------------------------------------------
alter table public.events enable row level security;

-- SELECT : tous les utilisateurs authentifiés peuvent lire les événements
drop policy if exists "events_select_authenticated" on public.events;
create policy "events_select_authenticated"
  on public.events for select
  to authenticated
  using (true);

-- INSERT : tout authentifié peut créer un événement, created_by doit être auth.uid()
drop policy if exists "events_insert_authenticated" on public.events;
create policy "events_insert_authenticated"
  on public.events for insert
  to authenticated
  with check (created_by = (select auth.uid()));

-- UPDATE : seul le créateur peut modifier son événement
drop policy if exists "events_update_own" on public.events;
create policy "events_update_own"
  on public.events for update
  to authenticated
  using (created_by = (select auth.uid()))
  with check (created_by = (select auth.uid()));

-- DELETE : seul le créateur peut supprimer son événement
drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own"
  on public.events for delete
  to authenticated
  using (created_by = (select auth.uid()));
