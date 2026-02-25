-- =============================================================================
-- 001_schema.sql — Tables + trigger pour Supabase Auth
-- À exécuter en premier dans le SQL Editor du dashboard Supabase.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table public.users (profil lié à auth.users)
-- Une ligne par utilisateur authentifié. Créée automatiquement à l'inscription.
-- -----------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index pour les recherches par username
create index if not exists idx_users_username on public.users(username);

-- Trigger : créer une ligne dans public.users à chaque nouvel inscrit (auth.users)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, username, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    now(),
    now()
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- Table messages (éphémères 24h)
-- -----------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  text text,
  media_url text,
  media_type text,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists idx_messages_expires_at on public.messages(expires_at);
create index if not exists idx_messages_created_at on public.messages(created_at desc);

-- -----------------------------------------------------------------------------
-- Table events (calendrier partagé)
-- -----------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz not null,
  created_by uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_events_event_date on public.events(event_date);

-- -----------------------------------------------------------------------------
-- Commentaires (optionnel, pour la doc)
-- -----------------------------------------------------------------------------
comment on table public.users is 'Profils utilisateurs, synchronisés avec auth.users';
comment on table public.messages is 'Messages éphémères (expiration 24h)';
comment on table public.events is 'Événements du calendrier partagé';
