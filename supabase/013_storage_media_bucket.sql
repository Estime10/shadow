-- =============================================================================
-- 013_storage_media_bucket.sql — Policies RLS pour le bucket Storage "media"
--
-- AVANT d'exécuter ce fichier :
-- 1. Dashboard Supabase → Storage → New bucket
-- 2. Name: media
-- 3. Public: OFF (privé)
-- 4. Create bucket
--
-- Puis exécuter ce SQL (policies sur storage.objects).
-- Structure des chemins : {user_id}/image/{media_id} ou {user_id}/video/{media_id}
-- Si erreur "must be owner of table objects", créer les policies à la main dans
-- Storage → media → Policies (voir docs/STORAGE_MEDIA.md).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- RLS sur storage.objects
-- Lecture : authentifié uniquement. Insert/Update/Delete : uniquement son dossier.
-- -----------------------------------------------------------------------------

-- Lecture : tout utilisateur authentifié peut voir les fichiers du bucket media
-- (les messages sont déjà protégés par RLS conversations/messages ; le média n'est utile que si on a le lien)
drop policy if exists "media_select_authenticated" on storage.objects;
create policy "media_select_authenticated"
on storage.objects for select
to authenticated
using (bucket_id = 'media');

-- Insertion : uniquement dans son dossier {auth.uid()}/image/... ou {auth.uid()}/video/...
drop policy if exists "media_insert_own_folder" on storage.objects;
create policy "media_insert_own_folder"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Mise à jour : uniquement dans son dossier
drop policy if exists "media_update_own_folder" on storage.objects;
create policy "media_update_own_folder"
on storage.objects for update
to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Suppression : uniquement dans son dossier (pour "vu une fois puis supprimé")
drop policy if exists "media_delete_own_folder" on storage.objects;
create policy "media_delete_own_folder"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'media'
  and (storage.foldername(name))[1] = auth.uid()::text
);
