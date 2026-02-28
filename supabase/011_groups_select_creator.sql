-- =============================================================================
-- 011_groups_select_creator.sql — SELECT groupe pour le créateur (RETURNING après INSERT)
-- À exécuter après 007_groups.sql.
-- Sans cette policy, l'INSERT avec .select("id") échoue en RLS : le créateur
-- n'est pas encore dans group_members au moment du RETURNING.
-- =============================================================================

drop policy if exists "groups_select_creator" on public.groups;
create policy "groups_select_creator"
  on public.groups for select
  to authenticated
  using (created_by_user_id = (select auth.uid()));
