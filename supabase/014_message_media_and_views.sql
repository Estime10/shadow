-- =============================================================================
-- 014_message_media_and_views.sql — Médias messages (image/vidéo) + "vu une fois"
-- À exécuter après 013 (bucket media + policies).
-- message_media : lien message → fichier Storage (pour pouvoir supprimer le fichier à la vue).
-- message_media_views : qui a vu le média (bouton désactivé après vue, puis suppression fichier + row).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table message_media (1 row par message qui a un média)
-- storage_path = chemin dans le bucket media, ex. {user_id}/image/{uuid}
-- -----------------------------------------------------------------------------
create table if not exists public.message_media (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  type text not null check (type in ('image', 'video')),
  storage_path text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_message_media_message_id on public.message_media(message_id);
create index if not exists idx_message_media_storage_path on public.message_media(storage_path);

comment on table public.message_media is 'Média (image/vidéo) attaché à un message ; supprimé (row + fichier Storage) après vue par le destinataire.';

-- -----------------------------------------------------------------------------
-- Table message_media_views (qui a ouvert le média = bouton désactivé)
-- -----------------------------------------------------------------------------
create table if not exists public.message_media_views (
  message_id uuid not null references public.messages(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  primary key (message_id, user_id)
);

create index if not exists idx_message_media_views_user_id on public.message_media_views(user_id);

comment on table public.message_media_views is 'Enregistrement de vue d un média (pour désactiver le bouton et déclencher la suppression).';

-- -----------------------------------------------------------------------------
-- RLS message_media
-- -----------------------------------------------------------------------------
alter table public.message_media enable row level security;

-- Lecture : même règle que messages (membre de la conversation)
drop policy if exists "message_media_select_conversation_member" on public.message_media;
create policy "message_media_select_conversation_member"
  on public.message_media for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = message_media.message_id
      and (
        (c.type = 'direct' and (c.user_1_id = auth.uid() or c.user_2_id = auth.uid()))
        or (c.type = 'group' and c.group_id is not null and exists (
          select 1 from public.group_members gm
          where gm.group_id = c.group_id and gm.user_id = auth.uid()
        ))
      )
    )
  );

-- Insertion : uniquement l'auteur du message (à la création du message avec média)
drop policy if exists "message_media_insert_own_message" on public.message_media;
create policy "message_media_insert_own_message"
  on public.message_media for insert
  to authenticated
  with check (
    exists (
      select 1 from public.messages m
      where m.id = message_media.message_id and m.user_id = auth.uid()
    )
  );

-- Suppression : membre de la conversation (destinataire qui a vu, ou auteur) pour "vu une fois puis supprimé"
drop policy if exists "message_media_delete_conversation_member" on public.message_media;
create policy "message_media_delete_conversation_member"
  on public.message_media for delete
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = message_media.message_id
      and (
        (c.type = 'direct' and (c.user_1_id = auth.uid() or c.user_2_id = auth.uid()))
        or (c.type = 'group' and c.group_id is not null and exists (
          select 1 from public.group_members gm
          where gm.group_id = c.group_id and gm.user_id = auth.uid()
        ))
      )
    )
  );

-- -----------------------------------------------------------------------------
-- RLS message_media_views
-- -----------------------------------------------------------------------------
alter table public.message_media_views enable row level security;

-- Lecture : membre de la conversation (pour savoir "ai-je déjà vu ?")
drop policy if exists "message_media_views_select_conversation_member" on public.message_media_views;
create policy "message_media_views_select_conversation_member"
  on public.message_media_views for select
  to authenticated
  using (
    exists (
      select 1 from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = message_media_views.message_id
      and (
        (c.type = 'direct' and (c.user_1_id = auth.uid() or c.user_2_id = auth.uid()))
        or (c.type = 'group' and c.group_id is not null and exists (
          select 1 from public.group_members gm
          where gm.group_id = c.group_id and gm.user_id = auth.uid()
        ))
      )
    )
  );

-- Insertion : uniquement pour soi (user_id = auth.uid()) et si membre de la conversation
drop policy if exists "message_media_views_insert_own" on public.message_media_views;
create policy "message_media_views_insert_own"
  on public.message_media_views for insert
  to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.messages m
      join public.conversations c on c.id = m.conversation_id
      where m.id = message_media_views.message_id
      and (
        (c.type = 'direct' and (c.user_1_id = auth.uid() or c.user_2_id = auth.uid()))
        or (c.type = 'group' and c.group_id is not null and exists (
          select 1 from public.group_members gm
          where gm.group_id = c.group_id and gm.user_id = auth.uid()
        ))
      )
    )
  );
