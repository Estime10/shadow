-- =============================================================================
-- 007_groups.sql — Type conversation + tables groups & group_members + RLS
-- À exécuter après 006_user_message_settings.sql.
-- Permet des conversations de type groupe (N participants) en plus du direct (1:1).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Enum : type de conversation
-- -----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'conversation_type_enum') then
    create type public.conversation_type_enum as enum ('direct', 'group');
  end if;
end
$$;

comment on type public.conversation_type_enum is 'direct = 1:1 (user_1_id, user_2_id) ; group = groupe (group_id)';

-- -----------------------------------------------------------------------------
-- Table groups (nom du groupe, créateur)
-- -----------------------------------------------------------------------------
create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by_user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create index if not exists idx_groups_created_by on public.groups(created_by_user_id);

comment on table public.groups is 'Groupe de discussion ; nom éditable par le créateur (created_by_user_id)';

-- -----------------------------------------------------------------------------
-- Table group_members (qui est dans quel groupe)
-- -----------------------------------------------------------------------------
create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  joined_at timestamptz not null default now(),
  constraint group_members_unique unique (group_id, user_id)
);

create index if not exists idx_group_members_group_id on public.group_members(group_id);
create index if not exists idx_group_members_user_id on public.group_members(user_id);

comment on table public.group_members is 'Membres d un groupe ; utilisé pour RLS conversations/messages de type group';

-- -----------------------------------------------------------------------------
-- RLS groups
-- -----------------------------------------------------------------------------
alter table public.groups enable row level security;

-- SELECT : uniquement si je suis membre du groupe
drop policy if exists "groups_select_member" on public.groups;
create policy "groups_select_member"
  on public.groups for select
  to authenticated
  using (
    exists (
      select 1 from public.group_members gm
      where gm.group_id = groups.id and gm.user_id = (select auth.uid())
    )
  );

-- INSERT : tout utilisateur authentifié peut créer un groupe (créateur)
drop policy if exists "groups_insert_authenticated" on public.groups;
create policy "groups_insert_authenticated"
  on public.groups for insert
  to authenticated
  with check (created_by_user_id = (select auth.uid()));

-- UPDATE : seul le créateur peut modifier (ex. nom du groupe)
drop policy if exists "groups_update_creator" on public.groups;
create policy "groups_update_creator"
  on public.groups for update
  to authenticated
  using (created_by_user_id = (select auth.uid()))
  with check (created_by_user_id = (select auth.uid()));

-- DELETE : à définir (ex. créateur seulement) — pour l'instant même règle que update
drop policy if exists "groups_delete_creator" on public.groups;
create policy "groups_delete_creator"
  on public.groups for delete
  to authenticated
  using (created_by_user_id = (select auth.uid()));

-- -----------------------------------------------------------------------------
-- RLS group_members
-- -----------------------------------------------------------------------------
alter table public.group_members enable row level security;

-- SELECT : chaque utilisateur ne voit que ses propres lignes (ses appartenances aux groupes).
-- Évite la récursion : pas de sous-requête sur group_members dans la policy.
drop policy if exists "group_members_select_member" on public.group_members;
create policy "group_members_select_member"
  on public.group_members for select
  to authenticated
  using (user_id = (select auth.uid()));

-- INSERT : créateur du groupe peut ajouter des membres ; ou logique d'invitation à préciser
drop policy if exists "group_members_insert_creator" on public.group_members;
create policy "group_members_insert_creator"
  on public.group_members for insert
  to authenticated
  with check (
    exists (
      select 1 from public.groups g
      where g.id = group_id and g.created_by_user_id = (select auth.uid())
    )
  );

-- DELETE : se retirer soi-même (user_id = auth.uid()) ou créateur qui retire un membre
drop policy if exists "group_members_delete_self_or_creator" on public.group_members;
create policy "group_members_delete_self_or_creator"
  on public.group_members for delete
  to authenticated
  using (
    user_id = (select auth.uid())
    or exists (
      select 1 from public.groups g
      where g.id = group_id and g.created_by_user_id = (select auth.uid())
    )
  );
