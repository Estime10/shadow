# Analyse architecture : DRY, SOLID, types, logger

**Date :** 13 mars 2025  
**Périmètre :** `features/`, `features/messages/components/`, `lib/`, `types/`

**Refactor effectué :** Les phases 1 à 3 et la convention ROOM_CONVERSATION_ID ont été appliquées (parseMediaType, useInvalidateMessagesCache, props.ts, dateUtils scindé, logger unifié, imports constants).

---

## 1. Résumé exécutif

| Thème                        | Constat                                                                              | Priorité |
| ---------------------------- | ------------------------------------------------------------------------------------ | -------- |
| **DRY**                      | 1 duplication nette (`parseMediaType`), 1 pattern répété (mutate + invalidate cache) | Haute    |
| **SOLID**                    | SRP faible dans `dateUtils`, dépendance feature → CRUD dans `props.ts`               | Moyenne  |
| **Logique métier dans l’UI** | Aucun appel Supabase dans les `.tsx` ; formulaires délèguent aux actions             | OK       |
| **Types dupliqués**          | Pas de définitions dupliquées ; réexports corrects                                   | OK       |
| **Logger**                   | 2 implémentations (lib vs messages) ; stratégie à unifier ou documenter              | Moyenne  |
| **Constantes**               | `ROOM_CONVERSATION_ID` : source unique, imports incohérents                          | Basse    |

---

## 2. Violations DRY

### 2.1 `parseMediaType` dupliquée (priorité haute)

**Constat :** Même fonction (string → `"image" | "video" | null`) à deux endroits.

| Fichier                                                | Lignes |
| ------------------------------------------------------ | ------ |
| `lib/supabase/CRUD/messages/mappers/mappers.ts`        | 5–8    |
| `features/messages/lib/mapRealtimeMessageToMessage.ts` | 15–18  |

**Action :**

1. Créer un module partagé :
   - **Option A :** `lib/supabase/CRUD/messages/parseMediaType/parseMediaType.ts` (côté CRUD, réutilisable par les mappers et la feature).
   - **Option B :** `features/messages/lib/parseMediaType/parseMediaType.ts` et faire importer le mapper depuis la feature (moins propre car le CRUD ne doit pas dépendre de la feature).

2. **Recommandation :** Option A. Exporter depuis `lib/supabase/CRUD/messages/` (ou un sous-dossier dédié) et importer dans :
   - `lib/supabase/CRUD/messages/mappers/mappers.ts`
   - `features/messages/lib/mapRealtimeMessageToMessage.ts`

3. Typer le retour avec `MessageMediaType` depuis `@/types` pour garder une seule source de vérité.

---

### 2.2 Pattern « mutate + invalidateMessagesCache » répété (priorité haute)

**Constat :** Quatre hooks refont la même chose : `useSWRConfig().mutate` puis `invalidateMessagesCache(mutate as InvalidateMessagesCacheMutate, { ... })`.

| Fichier                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/messages/components/messageId/MessageBubble/useMessageMediaViewer/useMessageMediaViewer.ts` (l.35, 43)                                  |
| `features/messages/components/messageId/MessageBubble/MessageBubbleMenu/useMessageBubbleMenuConfirm/useMessageBubbleMenuConfirm.ts` (l.32, 42–43) |
| `features/messages/components/messageId/MessageBubble/MessageBubbleEditForm/useMessageBubbleEditForm/useMessageBubbleEditForm.ts` (l.30, 36–37)   |
| `features/messages/components/messageId/MessageInput/useMessageSubmit/useMessageSubmit.ts` (l.30, 43–44)                                          |

**Action :**

1. Créer un hook dédié dans la feature messages, par exemple :
   - `features/messages/lib/useInvalidateMessagesCache/useInvalidateMessagesCache.ts`
2. Signature proposée :
   ```ts
   export function useInvalidateMessagesCache(): (params: InvalidateMessagesCacheParams) => void;
   ```
   Le hook utilise `useSWRConfig()`, caste une fois `mutate` en `InvalidateMessagesCacheMutate`, et retourne une fonction qui appelle `invalidateMessagesCache(mutate, params)`.
3. Remplacer dans les 4 hooks :
   - `const { mutate } = useSWRConfig();` + `invalidateMessagesCache(mutate as ..., { ... })`
   - par `const invalidate = useInvalidateMessagesCache();` puis `invalidate({ conversationId, threadCacheKey, ... })`.

Effets : plus de cast dispersé, un seul point d’accès à SWR pour l’invalidation messages, respect du DRY.

---

## 3. Respect de SOLID

### 3.1 SRP : `features/calendar/utils/dateUtils.ts` (priorité moyenne)

**Constat :** Le fichier mélange :

- Utilitaires « grille de mois » : `getMonthGridDays`, `getWeekday`, `getStartOfMonth`, `getEndOfMonth`, `isSameDay`, `isCurrentMonth`, `toDateOnlyISO`.
- Formatage d’affichage : `formatDateLabel`, `formatEventTime`, `formatEventDayTime`, `formatEventDateTime`.

**Action :**

1. Scinder en deux modules (ou deux fichiers dans le même dossier) :
   - `monthGridUtils.ts` (ou `grid/`) : tout ce qui concerne la grille et les calculs de dates.
   - `formatEventDate.ts` (ou `format/`) : `formatDateLabel`, `formatEventTime`, `formatEventDayTime`, `formatEventDateTime`.
2. Garder un `dateUtils.ts` qui réexporte les deux si besoin pour ne pas casser les imports, ou mettre à jour les imports vers les nouveaux modules.

---

### 3.2 Dépendance feature → détail CRUD : `features/messages/types/props/props.ts` (priorité moyenne)

**Constat :**

```ts
import type { MessageDisappearAfterMinutes } from "@/lib/supabase/CRUD/profiles/types/types";
```

Le type `MessageDisappearAfterMinutes` (et les options) sont définis dans `types/profile.ts` et réexportés par `@/types`. Le CRUD `profiles/types/types.ts` ne fait que réexporter depuis `@/types`.

**Action :**

1. Remplacer l’import par :
   ```ts
   import type { MessageDisappearAfterMinutes } from "@/types";
   ```
2. Règle à suivre : les features ne doivent pas importer des types depuis les couches CRUD quand le type existe dans `@/types`. Les types de domaine vivent dans `types/` ; les features et le CRUD s’y réfèrent.

---

## 4. Logique métier dans l’UI

**Constat :** Aucun appel à `createClient`, `getSupabase` ou `supabase.*` dans les fichiers `.tsx` de `features/`.

- Les formulaires (ex. `LoginForm.tsx`, `AttachMediaModal`) construisent des données et appellent des actions ou des hooks qui eux-mêmes appellent les actions. La logique métier est bien dans les actions et hooks.
- Les composants messages (ex. `MessageBubbleView`, `AttachMediaModal`) délèguent à des hooks dédiés (`useMessageMediaViewer`, `useAttachMediaModal`, etc.).

**Action :** Aucun refactor obligatoire. Pour aller plus loin, on peut extraire la construction du `FormData` + appel `loginAction` du `LoginForm` dans un hook du type `useLoginSubmit()` pour alléger le composant (optionnel).

---

## 5. Types : doublons et cohérence

**Constat :**

- **Message, Conversation, MessageRow, etc. :** une seule définition (dans `types/` ou réexport depuis `@/types`). Pas de duplication.
- **MessagesPageContent / MessageIdPageContent :** définis dans `types/messages-content.ts` ; `features/messages/types/content/content.ts` réexporte depuis `@/types`. Source unique.
- **RealtimeMessageRow :** défini uniquement dans `features/messages/lib/mapRealtimeMessageToMessage.ts` (forme minimale payload Realtime). Ce n’est pas un doublon de `MessageRow` (forme DB complète), c’est volontaire.

**Action :** Aucun doublon à supprimer.

Optionnel : introduire un type générique « résultat success/error » (ex. `Result<T, E>`) pour unifier les retours du type `{ success: true; ... } | { success: false; error: string }` (auth, getSignedMediaUrl, uploadMessageMediaToStorage, etc.). À traiter seulement si on veut homogénéiser les signatures.

---

## 6. Logger : deux implémentations (priorité moyenne)

**Constat :** Deux modules distincts :

| Fichier                                  | API                                                                                    | Usage                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `lib/logger/logger.ts`                   | `log(tag, message, data?)`, `logError(tag, message, error?)` ; désactivé en production | 1 usage : `features/messages/actions/markMessagesAsReadAction/markMessagesAsReadAction.ts`                        |
| `features/messages/lib/logger/logger.ts` | `messagesLogger.upload`, `.submit`, `.media` (console.log avec préfixe `[Messages]`)   | 4 usages : `useAttachMedia.ts`, `useMessageSubmit.ts`, `useAttachMediaModal.ts`, `uploadMessageMediaToStorage.ts` |

Il n’y a pas deux appels identiques dupliqués, mais **deux stratégies** : logger global par tag vs logger feature avec méthodes nommées.

**Actions possibles :**

1. **Option A – Unifier sur le logger global :**  
   Supprimer `features/messages/lib/logger/logger.ts`. Remplacer les appels par `log("messages-upload", ...)`, `log("messages-submit", ...)`, `log("messages-media", ...)` depuis `@/lib/logger/logger`. Avantage : un seul logger, désactivable en prod. Inconvénient : migration de 4 fichiers.

2. **Option B – Garder les deux et documenter :**  
   Dans une règle ou un README technique : « Logger global = `lib/logger` (tag-based, désactivé en prod). Logger métier messages = `features/messages/lib/logger` pour le debug dédié. Ne pas ajouter un 3ᵉ logger ailleurs. »

3. **Recommandation :** Option A pour un seul point de configuration et cohérence. Si tu veux garder un préfixe `[Messages]` explicite, le logger global peut accepter un tag `"messages-upload"` et formater en `[shadow] messages-upload`.

---

## 7. Constantes : ROOM_CONVERSATION_ID (priorité basse)

**Constat :**

- Source unique : `lib/supabase/constants.ts`.
- Réexportée par : `features/messages/constants/index.ts`, `lib/supabase/CRUD/messages/types/types.ts`, `lib/supabase/CRUD/index.ts`.
- Imports dans le code : tantôt `@/lib/supabase/constants`, tantôt `@/features/messages/constants`, tantôt `@/lib/supabase/CRUD`.

**Action :**

- Choisir une convention d’import et l’appliquer partout, par exemple :
  - **Option 1 :** Toujours `@/lib/supabase/constants` pour tout ce qui est « constante Supabase ».
  - **Option 2 :** Dans la feature messages, importer depuis `@/features/messages/constants` (qui réexporte depuis lib) pour garder la feature autonome.
- Documenter la règle (ex. dans ce fichier ou dans les Cursor rules) pour les prochains fichiers.

---

## 8. Plan d’opération proposé

### Phase 1 – DRY (impact direct, faible risque)

1. Extraire `parseMediaType` dans `lib/supabase/CRUD/messages/parseMediaType/parseMediaType.ts` (ou équivalent), typage avec `MessageMediaType` de `@/types`. Mettre à jour les deux mappers.
2. Créer `useInvalidateMessagesCache` et refactorer les 4 hooks pour l’utiliser.

### Phase 2 – SOLID et cohérence

3. Corriger l’import dans `features/messages/types/props/props.ts` : `MessageDisappearAfterMinutes` depuis `@/types`.
4. Scinder `features/calendar/utils/dateUtils.ts` en `monthGridUtils` + `formatEventDate` (et adapter les imports).

### Phase 3 – Logger et constantes

5. Décider Option A ou B pour le logger ; si A, migrer les 4 usages du logger messages vers `lib/logger`.
6. Fixer la convention d’import pour `ROOM_CONVERSATION_ID` et mettre à jour les fichiers concernés.

### Phase 4 – Optionnel

7. Hook `useLoginSubmit()` pour alléger `LoginForm` (optionnel).
8. Type `Result<T, E>` partagé pour les retours success/error (optionnel).

---

## 9. Fichiers impactés (référence)

| Action                     | Fichiers à modifier / créer                                                                                                                                                                                                                          |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| parseMediaType             | Créer `lib/supabase/CRUD/messages/parseMediaType/parseMediaType.ts` ; modifier `mappers.ts`, `mapRealtimeMessageToMessage.ts`                                                                                                                        |
| useInvalidateMessagesCache | Créer `features/messages/lib/useInvalidateMessagesCache/useInvalidateMessagesCache.ts` ; modifier les 4 hooks listés en 2.2                                                                                                                          |
| props.ts import            | `features/messages/types/props/props.ts`                                                                                                                                                                                                             |
| dateUtils SRP              | Créer `monthGridUtils.ts` et `formatEventDate.ts` (ou sous-dossiers) ; modifier `dateUtils.ts` et tout fichier qui importe ces fonctions                                                                                                             |
| Logger                     | Si Option A : supprimer `features/messages/lib/logger/logger.ts` ; modifier `useAttachMedia.ts`, `useMessageSubmit.ts`, `useAttachMediaModal.ts`, `uploadMessageMediaToStorage.ts`, et éventuellement `markMessagesAsReadAction.ts` pour uniformiser |
| ROOM_CONVERSATION_ID       | `app/messages/[id]/page.tsx`, `getThreadDataAction.ts`, `getRoomConversation.ts`, `useThreadWithCache.ts`, tests mappers, etc. (convention d’import uniquement)                                                                                      |

---

_Document généré pour guider le refactor. À mettre à jour après chaque phase._
