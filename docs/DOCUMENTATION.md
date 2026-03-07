# Documentation Shade — Guide développeur

Documentation centralisée de l’application **Shade** : vue d’ensemble, installation, architecture, fonctionnalités, tests et conventions. Objectif : permettre à un·e autre développeur·euse de comprendre et de faire évoluer le projet rapidement.

---

## Table des matières

1. [Vue d’ensemble](#1-vue-densemble)
2. [Prérequis et installation](#2-prérequis-et-installation)
3. [Variables d’environnement](#3-variables-denvironnement)
4. [Structure du projet](#4-structure-du-projet)
5. [Stack technique](#5-stack-technique)
6. [Routing et protection des routes](#6-routing-et-protection-des-routes)
7. [Fonctionnalités (features)](#7-fonctionnalités-features)
8. [Données, Supabase et Realtime](#8-données-supabase-et-realtime)
9. [Tests](#9-tests)
10. [Sécurité](#10-sécurité)
11. [Conventions de code](#11-conventions-de-code)
12. [Où trouver quoi — guide rapide](#12-où-trouver-quoi--guide-rapide)

---

## 1. Vue d’ensemble

**Shade** est une application web privée avec :

- **Authentification** : login / inscription (Supabase Auth).
- **Messagerie** : conversations directes et de groupe, messages éphémères (disparition configurable), indicateurs de lecture.
- **Calendrier** : événements personnels, grille mensuelle, création / édition / suppression.
- **Notifications** : page dédiée (structure en place).
- **PWA** : installable (manifest, service worker si configuré).

**Principes directeurs :**

- **App Router** Next.js : routing et composition dans `app/`, logique métier dans `features/`.
- **TypeScript strict** : pas de `any` ; validation des entrées externes (Zod).
- **Server Components par défaut** ; `"use client"` uniquement pour formulaires, modales, Realtime, état local.
- **Une feature = un domaine métier** (auth, calendar, messages, home) avec actions, composants, schémas, data.

---

## 2. Prérequis et installation

- **Node.js** 20+
- **pnpm** (recommandé)

```bash
git clone <repo>
cd shade
pnpm install
cp .env.example .env.local   # puis renseigner les variables (voir §3)
pnpm dev
```

L’app est disponible sur `http://localhost:3000`. Sans variables d’environnement Supabase, le middleware peut renvoyer une erreur 503 (configuration manquante).

**Commandes principales :**

| Commande                 | Description              |
| ------------------------ | ------------------------ |
| `pnpm dev`               | Serveur de développement |
| `pnpm build`             | Build de production      |
| `pnpm start`             | Démarrer en production   |
| `pnpm lint`              | ESLint                   |
| `pnpm run test:run`      | Tests unitaires (Vitest) |
| `pnpm run test:coverage` | Tests + couverture       |
| `pnpm run e2e`           | Tests E2E (Playwright)   |
| `pnpm exec tsc --noEmit` | Vérification TypeScript  |

---

## 3. Variables d’environnement

Créer **`.env.local`** à la racine :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

- **Obligatoires** pour que l’auth et le middleware fonctionnent correctement.
- Pour les **tests E2E avec utilisateur réel** (optionnel) : `E2E_USER_EMAIL` et `E2E_USER_PASSWORD`. Sans ces variables, les tests du flux authentifié sont ignorés (skipped).

---

## 4. Structure du projet

```
shade/
├── app/                    # Routing Next.js (App Router)
│   ├── (main)/             # Layout authentifié (header, nav) — /, /calendar, /notifications
│   ├── login/ register/    # Routes publiques
│   └── messages/ [id]/     # Liste conversations + thread
├── features/               # Logique métier par domaine
│   ├── auth/               # Login, register, schémas Zod
│   ├── calendar/           # Événements, vues calendrier
│   ├── messages/           # Conversations, messages, groupes, Realtime
│   └── home/               # Page d’accueil (HomeView)
├── lib/                    # Code transverse (config, Supabase, utils, hooks)
├── components/             # UI réutilisable (layout, ui, animations)
├── types/                  # Tous les types — point d'entrée unique (voir §4)
├── e2e/                    # Tests E2E Playwright
├── __tests__/              # Tests unitaires Vitest
├── supabase/               # Migrations / politiques RLS (SQL)
└── docs/                   # Documentation (ce fichier, ARCHITECTURE, etc.)
```

**Règles par dossier :**

- **`app/`** : uniquement routing, metadata, composition. Pas de logique métier.
- **`features/<nom>/`** : tout le métier du domaine (actions, components, data, schemas, hooks, utils, types, constants). Chaque feature expose un **`index.ts`** (réexports uniquement).
- **`lib/`** : code réutilisable sans couplage métier (Supabase client/server, rate limit, config, utils).
- **`components/`** : composants UI génériques ; pas d’appels CRUD ou Server Actions directs.

Détails complets : **[docs/ARCHITECTURE.md](ARCHITECTURE.md)**.

---

## 5. Stack technique

| Couche                | Technologie                                        |
| --------------------- | -------------------------------------------------- |
| Framework             | Next.js 16 (App Router)                            |
| Langage               | TypeScript (strict)                                |
| UI                    | React 19, Tailwind CSS, Framer Motion (animations) |
| Auth / BDD / Realtime | Supabase (Auth, Postgres, Realtime)                |
| Cache client          | SWR (messages, thread)                             |
| Validation            | Zod                                                |
| Tests unitaires       | Vitest, @testing-library/react                     |
| Tests E2E             | Playwright                                         |

---

## 6. Routing et protection des routes

**Routes publiques (sans auth) :**  
Définies dans `lib/config/publicRoutes.ts` : **`/login`**, **`/register`**. Toute autre route nécessite une session.

**Middleware** (`lib/supabase/middleware.ts`) :

- Vérifie la session (JWT via `getClaims()`).
- Si non authentifié et route **non** publique → redirection vers **`/login`**.
- Si variables Supabase manquantes → comportement dégradé (à éviter en prod).

**Pages principales :**

| Route            | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `/`              | Accueil (layout main) — redirige vers `/login` si non auth |
| `/login`         | Connexion                                                  |
| `/register`      | Inscription                                                |
| `/messages`      | Liste des conversations                                    |
| `/messages/[id]` | Thread (conversation ou groupe)                            |
| `/calendar`      | Calendrier mensuel                                         |
| `/notifications` | Notifications                                              |

---

## 7. Fonctionnalités (features)

### 7.1 Auth (`features/auth/`)

- **Login** : formulaire → `loginAction` (Zod `loginSchema`) → `signInWithPassword` Supabase. Rate limiting côté serveur (voir `lib/rateLimit`).
- **Register** : formulaire → `registerAction` (Zod `registerSchema`) → `signUp` Supabase.
- **Schémas** : `loginSchema` (email, password), `registerSchema` (email, username, password min 8 caractères).
- **Composants** : `LoginForm`, `RegisterForm` (orchestrateurs + champs + actions + footer). Pas de logique métier dans les composants UI purs.

### 7.2 Messages (`features/messages/`)

- **Conversations** : directes (2 users) ou groupe (groupe + `group_members`). CRUD dans `lib/supabase/CRUD/` (messages, conversations, groups, message_reads).
- **Actions** : `createMessageAction`, `updateMessageAction`, `markMessagesAsReadAction`, `createGroupConversationAction`, etc. Toutes protégées par `requireUser`.
- **Realtime** : hook **`useMessagesRealtime`** (`lib/hooks/messages/useMessagesRealtime/`) — abonnement Supabase Realtime (postgres_changes sur `conversations` et `messages`), invalidation SWR `messages-list` et mise à jour du cache thread (INSERT/DELETE/UPDATE message).
- **Types** : `Message`, `Conversation` (voir `types/message.ts`, `features/messages/types/`). Mapping Realtime → Message : `features/messages/lib/mapRealtimeMessageToMessage.ts`.

### 7.3 Calendrier (`features/calendar/`)

- **Événements** : CRUD via `createEventAction`, `updateEventAction`, `deleteEventAction`. Schémas Zod pour création/édition.
- **Vues** : grille mensuelle, modales création/édition/détail, carousel d’événements.
- **Data** : `getEventsForCalendar` (ou équivalent) appelé depuis la page RSC, données passées aux vues.

### 7.4 Home (`features/home/`)

- **HomeView** : contenu de la page d’accueil (layout main). Peut afficher résumés, liens vers messages/calendrier, etc.

---

## 8. Données, Supabase et Realtime

**Clients Supabase :**

- **`lib/supabase/client.ts`** : client navigateur (auth, Realtime). Utilisé dans les composants client (ex. `useMessagesRealtime`).
- **`lib/supabase/server.ts`** : client serveur (cookies). Utilisé dans les Server Actions et les pages RSC.
- **Middleware** : refresh de session + redirection (voir §6).

**CRUD** (`lib/supabase/CRUD/`) :  
Fonctions métier qui appellent Supabase (events, messages, conversations, groups, profiles, message_reads). Elles utilisent **`requireUser(supabase)`** pour garantir un utilisateur connecté et appliquent les filtres (ex. `user_id`, `created_by`) pour éviter les IDOR.

**Realtime :**

- **`useMessagesRealtime(conversationIds, currentUserId, { threadCacheKey })`** : s’abonne aux changements `conversations` et `messages`. En cas d’INSERT/DELETE/UPDATE message, appelle `mutate("messages-list")` et, si `threadCacheKey` correspond au thread affiché, met à jour le cache SWR du thread (ajout/suppression/édition du message) sans refetch.
- Mapping payload Realtime → `Message` : `mapRealtimeMessageToMessage` (`features/messages/lib/mapRealtimeMessageToMessage.ts`).

**SWR :**  
Clé liste messages : `"messages-list"`. Clé thread : tableau type `["messages", conversationId]` ou `["messages", "room", userId]` (voir types dans le hook).

---

## 9. Tests

### 9.1 Tests unitaires (Vitest)

- **Emplacement :** `__tests__/` (structure miroir de `lib/`, `features/`, `app/`).
- **Lancement :** `pnpm run test:run` (ou `pnpm run test:coverage`).
- **Config :** `vitest.config.ts`, `vitest.setup.ts` (jest-dom).
- **Couverture :** schémas Zod, actions (createEvent, createMessage, login, etc.), utils (getFormDataRaw, getFirstZodError), rate limit, config (publicRoutes, paths), hooks (useClickOutside, **useMessagesRealtime**), mappers, etc.
- **Realtime :** tests de **`useMessagesRealtime`** avec mock Supabase (channel, callbacks INSERT/DELETE/UPDATE messages et conversations) et assertions sur les appels à `mutate`. Tests de **`mapRealtimeMessageToMessage`** (mapping des champs, `conversation_id` null → `"room"`).

### 9.2 Tests E2E (Playwright)

- **Emplacement :** `e2e/*.spec.ts`.
- **Lancement :** `pnpm run e2e` (démarre le serveur dev si pas en CI).
- **Config :** `playwright.config.ts` (testDir: `./e2e`, baseURL 3000, projet chromium). **Avant la première exécution :** `pnpm exec playwright install` pour installer les navigateurs.

**Fichiers et scénarios :**

| Fichier                        | Contenu                                                                                                                                                                                                                 |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **auth.spec.ts**               | Formulaires login/register, champs visibles, erreurs (identifiants invalides, mot de passe court), validation email vide (reste sur /login), lien `?registered=1`, navigation login ↔ register, lien Retour à l’accueil |
| **protected-routes.spec.ts**   | Sans auth : /, /messages, /calendar, /notifications, /messages/[id] redirigent vers /login ; /login et /register accessibles                                                                                            |
| **navigation.spec.ts**         | Liens login ↔ register, redirection / → login                                                                                                                                                                           |
| **accessibility.spec.ts**      | Labels des champs (email, mot de passe, pseudo), erreur login exposée via `role="alert"` (hors route announcer Next.js)                                                                                                 |
| **authenticated-flow.spec.ts** | **Conditionnel** : si `E2E_USER_EMAIL` et `E2E_USER_PASSWORD` sont définis, tests login puis accès à /, /messages, /calendar avec contenu attendu. Sinon : skipped.                                                     |

**Pièges évités dans les specs :**  
Le route announcer Next.js (`#__next-route-announcer__`) a aussi `role="alert"` ; les assertions sur les erreurs utilisent `getByText(...)` ou des sélecteurs qui excluent l’announcer. Les titres « Connexion » / « Inscription » sont ciblés via `getByRole("heading", { name: "..." })` pour éviter les doublons avec l’announcer.

---

## 10. Sécurité

- **Auth :** middleware + `requireUser` sur les Server Actions et CRUD sensibles. Pas d’exposition de stack ou de détails techniques en cas d’erreur.
- **Validation :** Zod sur toutes les entrées (FormData, params). Pas de confiance aux données externes.
- **RLS Supabase :** activé sur events, messages, conversations, groups, message_reads. Les CRUD sont alignés avec les politiques (filtres par `user_id`, `created_by`, appartenance conversation/groupe).
- **XSS :** pas de `dangerouslySetInnerHTML` ; React échappe par défaut.
- **Rate limiting :** présent sur le login (voir `lib/rateLimit`). À étendre selon besoin (register, actions métier).
- **Headers / CSP :** à renforcer en prod (voir rapport pentest).

Rapport détaillé : **[docs/PENTEST-SECURITY-AUDIT.md](PENTEST-SECURITY-AUDIT.md)**.

---

## 11. Conventions de code

- **Index (`index.ts`)** : uniquement réexports. Aucune logique, aucun calcul.
- **Composants** : un composant = un dossier avec un fichier principal (orchestrateur) et des sous-composants dans des sous-dossiers dédiés. Pas d’index dans les sous-dossiers ; import direct du fichier du composant. Détails : **[docs/CONVENTIONS-COMPOSANTS.md](CONVENTIONS-COMPOSANTS.md)**.
- **Nommage :** une action = un fichier (ex. `createEventAction.ts`). Un composant = un dossier + fichier du même nom (ex. `HomeView/HomeView.tsx`).
- **TypeScript :** pas de `any` ; types explicites pour params et retours. Données externes validées (Zod) avant usage.
- **Server Components par défaut ;** `"use client"` seulement si nécessaire (forms, modals, hooks Realtime, état local).

---

## 12. Où trouver quoi — guide rapide

| Besoin                     | Emplacement                                                           |
| -------------------------- | --------------------------------------------------------------------- |
| **Récupérer un type**      | **`import type { … } from "@/types"`** — point d'entrée unique        |
| Ajouter une page           | `app/<route>/page.tsx`                                                |
| Ajouter une route publique | `lib/config/publicRoutes.ts` + page dans `app/`                       |
| Nouvelle Server Action     | `features/<nom>/actions/` + schéma Zod dans `features/<nom>/schemas/` |
| Nouveau composant métier   | `features/<nom>/components/`                                          |
| Nouveau type partagé       | `types/<domaine>.ts` + export dans `types/index.ts`                   |
| Utilitaire transverse      | `lib/utils/` ou `lib/functions/`                                      |
| Config (routes, chemins)   | `lib/config/`                                                         |
| Constante métier           | `features/<nom>/constants/`                                           |
| Requête Supabase (CRUD)    | `lib/supabase/CRUD/`                                                  |
| Hook Realtime messages     | `lib/hooks/messages/useMessagesRealtime/`                             |
| Test unitaire              | `__tests__/` (structure miroir)                                       |
| Test E2E                   | `e2e/*.spec.ts`                                                       |

---

**Documentation liée :**

- [ARCHITECTURE.md](ARCHITECTURE.md) — Arborescence et règles par dossier
- [CONVENTIONS-COMPOSANTS.md](CONVENTIONS-COMPOSANTS.md) — Structure des composants
- [TYPES-ANALYSIS.md](TYPES-ANALYSIS.md) — Centralisation des types, doublons et où définir un type
- [ANALYSE-MAINTENABILITE.md](ANALYSE-MAINTENABILITE.md) — Analyse maintenabilité, volume de fichiers et optimisations
- [PENTEST-SECURITY-AUDIT.md](PENTEST-SECURITY-AUDIT.md) — Audit de sécurité
