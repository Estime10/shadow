# Types — point d'entrée unique

Tous les types de l'application sont centralisés dans le dossier **`types/`**. Un seul fichier permet de les récupérer : **`@/types`** (comme un fichier de constantes).

```ts
import type { Message, Profile, CalendarEvent, SelectableItem } from "@/types";
```

---

## 1. Structure du dossier `types/`

| Fichier                     | Contenu                                                                                                                             |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **`types/index.ts`**        | Point d'entrée unique — réexporte tout le dossier. Importer depuis `@/types`.                                                       |
| `types/auth.ts`             | LoginResult, RegisterResult                                                                                                         |
| `types/message.ts`          | Message, Conversation                                                                                                               |
| `types/navigation.ts`       | NavItem                                                                                                                             |
| `types/layout.ts`           | LayoutChildrenProps                                                                                                                 |
| `types/calendar.ts`         | CalendarEvent                                                                                                                       |
| `types/profile.ts`          | Profile, CurrentUserProfile, ProfileRow, MessageDisappearAfterMinutes, MESSAGE_DISAPPEAR_MINUTES_OPTIONS                            |
| `types/ui.ts`               | SelectableItem                                                                                                                      |
| `types/messages-content.ts` | MessagesPageContent, MessageIdPageContent                                                                                           |
| `types/db.ts`               | EventRow, MessageRow, ConversationRow, GroupRow, MessageReadRow, GetMessagesVisibilityOptions, CreateEventParams, UpdateEventParams |

Les constantes liées aux types (ex. `MESSAGE_DISAPPEAR_MINUTES_OPTIONS`) sont exportées depuis `types/profile.ts` et réexportées par `types/index.ts`.

---

## 2. Où sont définis les types

- **Définition :** dans le fichier `types/<domaine>.ts` correspondant (une seule source de vérité).
- **CRUD / features :** les modules `lib/supabase/CRUD/*/types/` et `features/*/types/` **réexportent** depuis `@/types` pour garder les anciens chemins d'import valides (ex. `@/features/calendar/types`, `@/lib/supabase/CRUD`).
- **Nouveau type partagé :** créer ou compléter un fichier dans `types/`, puis l’ajouter dans `types/index.ts`.

---

## 3. Règle pour les formulaires (auth)

Pour la **forme des données de formulaire** (login, register), utiliser les types dérivés des schémas Zod : **LoginSchemaOutput**, **RegisterSchemaOutput** (exportés par `@/features/auth`). Les types `LoginResult` et `RegisterResult` restent dans `@/types`.

---

## 4. Constantes hors types

Les constantes métier (ex. **ROOM_CONVERSATION_ID**) restent dans `lib/supabase/CRUD` ou `features/*/constants/`. Seules les constantes **liées à un type** (ex. `MESSAGE_DISAPPEAR_MINUTES_OPTIONS` pour `MessageDisappearAfterMinutes`) sont dans `types/profile.ts`.
