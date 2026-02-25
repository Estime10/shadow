# Étapes à suivre — Ephemeral Friends App (Shadow)

Document de suivi pour aligner le code sur le [README](../README.md) et livrer l’app PWA avec messages éphémères, calendrier partagé et notifications realtime.

---

## 1. État des lieux (analyse rapide)

### Ce qui est déjà bien en place

| Domaine           | Détail                                                                                                                                              |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Architecture**  | App Router, `features/` (auth, messages), `lib/config`, `types/`, pas de logique métier dans l’UI. Conforme à [ARCHITECTURE.md](./ARCHITECTURE.md). |
| **TypeScript**    | Types centralisés (`message`, `auth`, `layout`), Zod pour le formulaire login, pas de `any`.                                                        |
| **Messages (UI)** | Liste conversations, thread par `[id]`, `MessageInput`, `MessageBubble`, safe-area et clavier gérés.                                                |
| **Auth**          | `LoginForm`, server action, schema Zod ; TODO explicite pour Supabase.                                                                              |
| **Pages**         | `/`, `/messages`, `/messages/[id]`, `/calendar`, `/notifications`, `/login` en place.                                                               |
| **Styles**        | Tailwind, variables CSS, `next/font` (Oswald, Space Mono), pas de style inline.                                                                     |

### Écarts par rapport au README

| README / spec                                     | Code actuel                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Supabase (DB, Realtime, Storage, Auth)            | Non installé, pas de `lib/supabase`, pas de variables d’environnement.                                                |
| Messages : texte + images + vidéos, 24h, realtime | Données en `fakeData.ts` ; pas de `expires_at` / `media_url` / `media_type` dans les types ; pas d’envoi ni d’upload. |
| Calendrier partagé (events)                       | Page placeholder « À brancher sur Supabase ».                                                                         |
| Notifications (badge, realtime)                   | Page placeholder « À brancher sur Supabase ».                                                                         |
| PWA (installable, manifest, SW)                   | Pas de `next-pwa`, pas de `manifest.json`, pas d’icône 512.                                                           |
| Tables SQL (users, messages, events)              | Non appliquées (à faire dans le projet Supabase).                                                                     |

---

## 2. Étapes à suivre (ordre recommandé)

### Phase 1 — Fondations Supabase & env

1. **Créer le projet Supabase** (si pas déjà fait).
2. **Exécuter le SQL du README** pour créer les tables `users`, `messages`, `events` (schéma décrit dans le README).
3. **Créer le bucket Storage** `messages-media` (public).
4. **Installer le client Supabase** :
   ```bash
   pnpm add @supabase/supabase-js
   ```
5. **Créer `lib/supabase/client.ts`** (ou `.js` si pas de TS dans ce fichier) avec `createClient(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`.
6. **Ajouter `.env.local`** (et optionnellement `.env.example`) avec :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
7. Ne pas commiter les secrets ; s’assurer que `.env.local` est dans `.gitignore`.

---

### Phase 2 — Messages (données réelles + éphémère 24h)

8. **Étendre les types** dans `types/message.ts` (ou types dédiés messages) :
   - `media_url?: string | null`
   - `media_type?: string | null`
   - `expires_at: string` (ISO) pour l’éphémère 24h.
9. **Créer une couche data/fetch** dans `features/messages/` :
   - Fonction `sendMessage({ text, file? })` : upload optionnel vers `messages-media`, puis `insert` dans `messages` avec `expires_at = now + 24h`.
   - Fonction `fetchMessages()` : `select` avec `.gt("expires_at", new Date().toISOString())`, tri par `created_at` desc.
10. **Realtime** : dans un hook ou composant dédié, souscrire aux `postgres_changes` sur `messages` (INSERT) et mettre à jour la liste/thread.
11. **Remplacer `fakeData`** par les appels Supabase (liste des conversations / messages selon le modèle choisi ; le README parle d’une table `messages` simple, pas de table `conversations` — à aligner avec le schéma SQL).
12. **Brancher `MessageInput`** : onSubmit qui appelle `sendMessage` (texte obligatoire, fichier optionnel), puis invalidation ou mise à jour via realtime.
13. **Afficher médias** dans `MessageBubble` (image / vidéo quand `media_url` + `media_type` présents).

---

### Phase 3 — Calendrier

14. **Créer les fonctions** dans `features/calendar/` (ou équivalent) :
    - `createEvent({ title, description, event_date })`
    - `fetchEvents()` : `select("*").order("event_date")`
15. **Page Calendrier** : afficher la liste (ou vue calendrier) des events et formulaire de création ; brancher sur Supabase.
16. Optionnel : realtime sur la table `events` pour mise à jour en direct.

---

### Phase 4 — Notifications

17. **Décider du modèle** : soit une table `notifications` (comme dans le README sneakers), soit dérivé des messages/events. Si table dédiée : créer la table + RLS.
18. **Fonctions** : `fetchNotifications()`, `markAsRead(id)`.
19. **Page Notifications** : liste + badge (nombre non lus) dans la nav ou le header.
20. **Realtime** : souscrire aux changements sur `notifications` pour le badge et la liste.

---

### Phase 5 — PWA

21. **Installer next-pwa** (ou alternative recommandée pour Next 16) :
    ```bash
    pnpm add next-pwa
    ```
    Vérifier la compatibilité avec Next 16 ; si besoin, utiliser une approche manuelle (Workbox, `public/sw.js` + enregistrement).
22. **Configurer `next.config.ts`** : wrapper la config avec `withPWA({ dest: "public" })` (ou équivalent selon la doc de next-pwa).
23. **Créer `public/manifest.json`** : `name`, `short_name`, `start_url`, `display: "standalone"`, `theme_color`, `background_color`, `icons` (dont 512x512).
24. **Ajouter une icône** `public/icon.png` (512x512).
25. **Layout racine** : ajouter le lien vers le manifest (`<link rel="manifest" href="/manifest.json" />`) si pas injecté automatiquement par next-pwa.

---

### Phase 6 — Nettoyage & déploiement

26. **Auth** : remplacer le TODO dans `loginAction` par l’appel à `supabase.auth.signInWithPassword` (ou méthode choisie) ; gérer redirect et erreurs.
27. **Suppression des messages expirés** : configurer un cron (Supabase ou externe) qui exécute le `DELETE FROM messages WHERE expires_at < now()` (ex. toutes les heures), comme indiqué dans le README.
28. **Tests** : vérifier les parcours critiques (envoi message, affichage, expiration, calendrier, notifications, PWA installable).
29. **Déploiement** : push GitHub + déploiement Vercel ; renseigner les variables d’environnement Supabase dans Vercel.

---

## 3. Checklist rapide

- [ ] Projet Supabase créé, tables et bucket en place
- [ ] `@supabase/supabase-js` installé, client dans `lib/supabase`
- [ ] `.env.local` avec `NEXT_PUBLIC_SUPABASE_*`
- [ ] Types messages avec `expires_at`, `media_url`, `media_type`
- [ ] Send message + upload Storage + realtime
- [ ] Liste/thread messages branchés Supabase (plus de fakeData pour la prod)
- [ ] Calendrier : CRUD events + page
- [ ] Notifications : table + badge + realtime
- [ ] PWA : next-pwa (ou équivalent), manifest, icône 512
- [ ] Auth login branchée Supabase
- [ ] Cron suppression messages expirés
- [ ] Déploiement Vercel + variables d’env

---

## 4. Références

- [README](../README.md) — spec fonctionnelle et stack
- [ARCHITECTURE.md](./ARCHITECTURE.md) — structure du projet et conventions
