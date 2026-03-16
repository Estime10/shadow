# Analyse de sécurité — Shadow (Ghost Riders)

Ce document résume les mesures de sécurité en place et les points de vigilance.

---

## 1. Authentification et autorisation

| Élément                    | Statut | Détail                                                                                                                                                                                                                                  |
| -------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Middleware**             | ✅     | `lib/supabase/middleware.ts` : utilisation de `getUser()` (et non `getClaims()`) pour distinguer utilisateur connecté / session anonyme. Redirection vers `/login` si non connecté sur toute route non publique.                        |
| **Routes publiques**       | ✅     | Uniquement `/login` et `/register` (`lib/config/publicRoutes.ts`). Toutes les autres routes exigent une session.                                                                                                                        |
| **Server Actions**         | ✅     | Les actions métier passent par des CRUD qui appellent `requireUser(supabase)` : `createMessage`, `createEvent`, `updateEvent`, `deleteEvent`, `findOrCreateConversation`, etc. Sans utilisateur connecté, l’action retourne une erreur. |
| **createMessageMediaView** | ✅     | Vérification explicite `getUser()` + `if (!user?.id) return { error: "Non authentifié" }`.                                                                                                                                              |

---

## 2. Variables d’environnement

| Élément         | Statut | Détail                                                                                                                                                                                       |
| --------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Validation**  | ✅     | `lib/config/env.ts` : schéma Zod pour `NEXT_PUBLIC_SUPABASE_URL` (URL) et `NEXT_PUBLIC_SUPABASE_ANON_KEY` (non vide). Erreur claire en cas de config invalide.                               |
| **Côté client** | ✅     | Le client Supabase (`lib/supabase/client.ts`) n’utilise pas `getEnv()` pour éviter des échecs Zod dans le bundle ; seules les variables `NEXT_PUBLIC_*` sont lues (exposées par définition). |
| **Secrets**     | ✅     | `.gitignore` : `.env*` ignoré. Aucun secret (service_role, etc.) n’est référencé dans le code côté client.                                                                                   |

---

## 3. Entrées utilisateur et validation

| Élément              | Statut | Détail                                                                                                                                                        |
| -------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login / Register** | ✅     | Données de formulaire validées par Zod (`loginSchema`, `registerSchema`). Extraction via `getFormDataRaw` avec clés limitées (`LOGIN_KEYS`, `REGISTER_KEYS`). |
| **Messages**         | ✅     | `parseCreateMessageFormData` (Zod) pour `createMessageAction`.                                                                                                |
| **Événements**       | ✅     | `parseCreateEventParams(params)` pour `createEventAction` ; paramètres typés et validés.                                                                      |
| **XSS**              | ✅     | Pas de `dangerouslySetInnerHTML` ; rendu React par défaut (échappement). Contenu utilisateur affiché comme texte.                                             |

---

## 4. Rate limiting

| Élément                   | Statut | Détail                                                                                                                               |
| ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Login**                 | ✅     | 10 tentatives / 15 min par identifiant client (`auth:login:${identifier}`).                                                          |
| **Register**              | ✅     | 5 tentatives / 15 min par identifiant client.                                                                                        |
| **Création de messages**  | ✅     | 100 messages / 15 min par IP (ou `x-forwarded-for` / `x-real-ip`).                                                                   |
| **Création d’événements** | ✅     | 30 événements / 15 min par IP.                                                                                                       |
| **Identifiant client**    | ✅     | `getClientIdentifier()` : `x-forwarded-for` (premier IP), puis `x-real-ip`, sinon `"unknown"`. Adapté au déploiement derrière proxy. |

Stockage en mémoire (Map) ; en production multi-instances, un store partagé (ex. Redis) est recommandé pour un rate limit global.

---

## 5. Middleware et matcher

| Élément               | Statut | Détail                                                                                                                                                                                                        |
| --------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Matcher**           | ✅     | Exclut `_next/static`, `_next/image`, favicon, PWA (`sw.js`, `workbox-*.js`, `manifest.json`), et extensions statiques (svg, png, jpg, jpeg, gif, webp, ico). Limite les appels `getUser()` aux vraies pages. |
| **Erreurs de config** | ✅     | Si `getEnv()` échoue (variables manquantes) → 503 avec message explicite. Si `getUser()` lance → 503. Pas de fuite d’info.                                                                                    |

---

## 6. Supabase (RLS et usage)

- Les opérations passent par le client Supabase côté serveur avec la session de l’utilisateur. Les politiques RLS (Row Level Security) côté base restent le filet de sécurité principal pour restreindre lecture/écriture par `user_id` ou rôle. À maintenir et auditer dans le projet Supabase.
- Aucune utilisation de la clé `service_role` dans cette app ; uniquement l’anon key + session utilisateur.

---

## 7. Synthèse

- **Authentification** : middleware + `getUser()` + routes publiques limitées + `requireUser()` dans les CRUD.
- **Validation** : Zod sur toutes les entrées (auth, messages, événements).
- **Rate limiting** : login, register, création de messages et d’événements.
- **Env** : validation Zod, pas de secrets en client, `.env` ignoré.
- **Rendu** : pas de HTML brut injecté ; risque XSS limité.

À faire selon besoin : audit RLS Supabase, store partagé pour le rate limit en multi-instances, et revue des politiques CORS / headers si exposition d’API.
