-- =============================================================================
-- 012_groups_rls_no_recursion.sql — Éviter la récursion RLS groups ↔ group_members
-- À exécuter après 011_groups_select_creator.sql.
-- L'INSERT sur group_members fait un SELECT sur groups ; la policy groups_select_member
-- lit group_members → récursion. On utilise une fonction SECURITY DEFINER qui lit
-- group_members sans passer par RLS.
-- =============================================================================

-- Fonction qui vérifie l'appartenance sans déclencher RLS sur group_members
create or replace function public.is_group_member(gid uuid, uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.group_members
    where group_id = gid and user_id = uid
  );
$$;

comment on function public.is_group_member(uuid, uuid) is
  'Vérifie si uid est membre du groupe gid ; SECURITY DEFINER pour éviter récursion RLS.';

-- Remplacer la policy qui lisait group_members directement
drop policy if exists "groups_select_member" on public.groups;
create policy "groups_select_member"
  on public.groups for select
  to authenticated
  using (public.is_group_member(id, (select auth.uid())));
