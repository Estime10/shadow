# Architecture du projet Shade

**Stack :** Next.js 16 (App Router), Supabase, TypeScript strict, React 19.

---

## 1. Arborescence

```
app/                    # Routing + orchestration uniquement
  (main)/               # Layout authentifié (header, nav)
  login/ register/      # Routes publiques
  messages/ [id]/       # Messagerie
  calendar/             # Calendrier
  notifications/

features/               # Logique métier par domaine
  auth/                 # Login, register, schemas
  calendar/             # Événements, calendrier
  messages/             # Conversations, messages, groupes
  home/                 # Page d'accueil (HomeView)

lib/                    # Code transverse (hors métier)
  config/               # PATHS, publicRoutes, pages, layout
  rateLimit/            # Rate limiting auth
  supabase/             # Client, server, middleware, CRUD
  utils/                # getFormDataRaw, getFirstZodError
  functions/            # normalizeTimeString, formatRelativeTime, etc.
  hooks/                # Hooks partagés (useClickOutside, etc.)

components/             # UI réutilisable (hors feature)
  ui/                   # Boutons, inputs
  layout/               # AppHeader, SectionWithTitle
  home/                 # FeatureCard
  icons/

types/                  # Types globaux (auth, message, navigation)
```

---

## 2. Règles par dossier

### `app/`

- **Rôle :** Routing, metadata, composition. Aucune logique métier.
- **Contenu :** `page.tsx` (fetch data si besoin, puis composition), `layout.tsx`, `metadata`.
- **Imports :** Depuis `@/features/<name>`, `@/lib/`, `@/components/`.

### `features/<name>/`

- **Rôle :** Tout le métier d’un domaine (auth, calendar, messages, home).
- **Sous-dossiers :**
  - `actions/` — Server Actions (appel CRUD, validation Zod, revalidatePath).
  - `components/` — Composants React du domaine.
  - `data/` — Fonctions de data fetching (pour les pages).
  - `schemas/` — Schémas Zod + parseurs (FormData, params).
  - `hooks/` — Hooks spécifiques au domaine.
  - `utils/` — Utilitaires métier.
  - `types/` — Types du domaine.
  - `constants/` — Constantes du domaine.
- **Public API :** Chaque feature expose un `index.ts` à la racine. Préférer importer depuis `@/features/<name>` quand c’est possible.

### `lib/`

- **Rôle :** Code réutilisable sans couplage métier (config, Supabase, rate limit, utils, fonctions pures).
- **Pas de** types ou logique spécifiques à un écran.

### `components/`

- **Rôle :** Composants UI génériques (layout, cartes, icônes). Pas de logique métier.
- **Pas d’** appel CRUD ou Server Action dans les composants UI ; les actions sont appelées depuis des composants de feature (forms, handlers).

### `types/`

- **Rôle :** Types partagés entre plusieurs features ou avec l’app (auth, message, navigation).

---

## 3. Index (orchestrateurs)

- Les fichiers `index.ts` **réexportent uniquement**. Aucune logique, aucun calcul.
- Permettent d’importer depuis `@/features/calendar` au lieu de `@/features/calendar/actions/createEventAction/...`.

---

## 4. Flux de données

- **Pages (RSC) :** Appellent des fonctions data (`getEventsForCalendar`, `getCurrentUserProfile`, etc.) puis passent les données aux vues (ex. `CalendarView`, `HomeView`).
- **Server Actions :** Reçoivent FormData ou params → validation Zod → CRUD (via `requireUser` + Supabase) → revalidatePath si succès.
- **Client :** SWR pour le cache (messages, thread) ; Realtime Supabase pour les mises à jour live.

---

## 5. Où ajouter quoi ?

| Besoin                   | Emplacement                                             |
| ------------------------ | ------------------------------------------------------- |
| Nouvelle page            | `app/<route>/page.tsx`                                  |
| Nouvelle action serveur  | `features/<name>/actions/` + schéma Zod dans `schemas/` |
| Nouveau composant métier | `features/<name>/components/`                           |
| Nouveau type partagé     | `types/` ou `features/<name>/types/`                    |
| Utilitaire transverse    | `lib/utils/` ou `lib/functions/`                        |
| Config (routes, chemins) | `lib/config/`                                           |
| Constante métier         | `features/<name>/constants/`                            |

---

## 6. Conventions

- **Nommage :** une action = un fichier (ex. `createEventAction.ts`). Un composant = un dossier avec fichier du même nom (ex. `HomeView/HomeView.tsx`).
- **Server Components par défaut ;** `"use client"` uniquement si nécessaire (forms, modals, realtime).
- **Validation :** toute donnée externe (FormData, params, API) est validée avec Zod avant usage.
