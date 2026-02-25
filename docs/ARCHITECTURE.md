# Architecture — Shade

## Principes

- **DRY** : une seule source de vérité pour le layout en-tête + main (`HeaderMainLayout`), les constantes (`lib/config`), les types (`types/`, `features/…/types/`).
- **SOLID** : composants à responsabilité unique, props typées, dépendance sur des types/abstractions.

---

## Structure

### App Router

| Route / groupe                      | Rôle                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| `app/layout.tsx`                    | Racine : html, body, wrapper `pb-20`, `AppNav` global.                        |
| `app/(main)/layout.tsx`             | Layout pour `/`, `/calendar`, `/notifications` : `HeaderMainLayout` (défaut). |
| `app/(main)/page.tsx`               | Accueil (contenu seul).                                                       |
| `app/(main)/calendar/page.tsx`      | Calendrier (contenu seul, `SectionWithTitle`).                                |
| `app/(main)/notifications/page.tsx` | Notifications (contenu seul, `SectionWithTitle`).                             |
| `app/messages/layout.tsx`           | Layout messages : `HeaderMainLayout` avec `MESSAGES_PAGE_MAIN_CLASS`.         |
| `app/messages/page.tsx`             | Liste messages (Header + Content).                                            |
| `app/messages/[id]/page.tsx`        | Conversation (Header + Content, contenu typé `MessageIdPageContent`).         |
| `app/login/page.tsx`                | Connexion (layout dédié, sans HeaderMainLayout).                              |

### Composants layout

- **`AppHeader`** : bandeau fixe avec lien accueil + Connexion.
- **`AppNav`** : barre de navigation globale (dans le layout racine uniquement).
- **`HeaderMainLayout`** : layout avec `AppHeader` + `<main>`, option `mainClassName` (config dans `lib/config/pages`). Utilisé par `(main)` et `messages`. Factory : `createHeaderMainLayout(mainClassName?)`.

### Config (`lib/config/`)

- **`layout.ts`** : `NAV_BOTTOM_REM`, `NAV_BOTTOM_PX` (hauteur nav).
- **`pages.ts`** : `MAIN_PAGE_MAIN_CLASS`, `MESSAGES_PAGE_MAIN_CLASS` (classes du `<main>`).

### Features

- **auth** : `LoginForm` + sous-dossier `login/` (schema, loginAction). Pas d’index.
- **messages** :
  - `components/messageId/` (page [id]), `components/messages/` (page liste), un sous-dossier par composant.
  - `data/fakeData.ts`, `types/props.ts`, `types/content.ts`.
  - L’app utilise `MessageIdPageContent` pour passer le contenu au feature.

### Types

- **Racine `types/`** : domaine global (`message`, `navigation`, `auth`, `layout`).
- **`types/layout.ts`** : `LayoutChildrenProps` (évite duplication sur les layouts).
- **Feature messages** : `types/props.ts` (props des composants), `types/content.ts` (contenu envoyé par l’app).

---

## DRY

- Layout en-tête + main : **HeaderMainLayout** uniquement (plus de div + AppHeader + main dupliqués).
- Constantes de layout et de pages : **lib/config**.
- Types de layout : **LayoutChildrenProps**.
- Contenu page [id] : **MessageIdPageContent** + props dérivées.

## SOLID

- **S** : HeaderMainLayout = en-tête + zone main ; pages = contenu ; features = logique métier.
- **O/C** : Extension par `mainClassName` et nouveaux layouts, pas en modifiant HeaderMainLayout.
- **L** : N/A.
- **I** : Props spécifiques par composant (pas de gros objets communs inutiles).
- **D** : Composants dépendent des types (props/content), pas d’implémentations concrètes.
