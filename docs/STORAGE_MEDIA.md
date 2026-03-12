# Storage médias (messages)

## 1. Créer le bucket (Dashboard)

La table `storage.buckets` est gérée par Supabase : on ne peut pas y insérer via le SQL Editor ("must be owner of table buckets").

1. **Dashboard** → **Storage** → **New bucket**.
2. **Name** : `media`.
3. **Public** : **OFF** (bucket privé).
4. **Create bucket**.

## 2. Appliquer les policies RLS

### Option A : SQL Editor

1. **Dashboard** → **SQL Editor**.
2. Coller le contenu de `supabase/013_storage_media_bucket.sql` (uniquement les policies).
3. **Run**.

Si tu obtiens **"must be owner of table objects"**, utiliser l’option B.

### Option B : Policies à la main (Dashboard)

1. **Storage** → clic sur le bucket **media** → onglet **Policies**.
2. **New policy** pour chaque règle ci-dessous.

| Policy name                | Allowed operation | Target roles  | USING expression (SELECT) / WITH CHECK (INSERT)                                         |
| -------------------------- | ----------------- | ------------- | --------------------------------------------------------------------------------------- |
| media_select_authenticated | SELECT            | authenticated | `bucket_id = 'media'`                                                                   |
| media_insert_own_folder    | INSERT            | authenticated | WITH CHECK : `bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text` |
| media_update_own_folder    | UPDATE            | authenticated | USING : `bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text`      |
| media_delete_own_folder    | DELETE            | authenticated | USING : `bucket_id = 'media' AND (storage.foldername(name))[1] = auth.uid()::text`      |

## 3. Structure des chemins

- **Images** : `{user_id}/image/{media_id}`
- **Vidéos** : `{user_id}/video/{media_id}`

`user_id` = `auth.uid()` (utilisateur connecté qui uploade).  
`media_id` = UUID (ex. généré côté app avant l’upload).

## 4. Sécurité (RLS)

- **Lecture** : tout utilisateur **authentifié** peut lire les objets du bucket `media` (les URLs signées ou le flux sont protégés par l’auth).
- **Insert / Update / Delete** : uniquement si le premier segment du chemin = `auth.uid()::text` (chaque user ne peut écrire/supprimer que dans son dossier).

## 5. Compression

La compression **n’est pas gérée par le bucket**. À faire :

- **Côté client** : compresser image/vidéo avant `storage.from('media').upload(...)` (recommandé pour limiter la taille et le coût).
- Ou **Edge Function** : déclenchée après upload pour recalculer/remplacer le fichier (plus lourd à maintenir).

## 6. Tables message_media et message_media_views (migration 014)

Exécuter **supabase/014_message_media_and_views.sql** dans le SQL Editor.

- **message_media** : un enregistrement par message qui a un média (`message_id`, `type` image|video, `storage_path`). Permet de supprimer le fichier Storage quand le destinataire a vu.
- **message_media_views** : (`message_id`, `user_id`, `viewed_at`) pour savoir qui a déjà ouvert le média (bouton désactivé).

RLS : lecture/écriture selon appartenance à la conversation (direct ou groupe).

## 7. Suite prévue (côté app)

- Envoi : upload vers `{user_id}/image|video/{media_id}`, puis création du message avec `media_url` / `media_type` + ligne dans `message_media`.
- Réception : afficher icône photo/vidéo ; au clic → modale plein écran.
- Après vue : insérer dans `message_media_views`, supprimer le fichier Storage, supprimer la ligne `message_media`, mettre à null `messages.media_url` / `media_type`.

- Table **media** (ou champs sur **messages**) : `id`, `message_id`, `type` (image/video), `storage_path`, `viewed_at`, etc.
- Envoi : upload vers `{user_id}/image|video/{media_id}`, puis création du message avec référence au média.
- Réception : afficher icône photo/vidéo ; au clic → modale plein écran.
- Après vue : désactiver le bouton, supprimer le fichier dans Storage et la ligne en base (comportement type “vu une fois”).
