# Analyse : suppression et disparition des messages

## Deux mécanismes distincts

### 1. Suppression explicite (DELETE en base)

- **Où** : `lib/supabase/CRUD/messages/deleteMessage/deleteMessage.ts` + `deleteMessageAction`.
- **Déclencheur** : l’utilisateur clique sur « Supprimer » dans le menu d’une bulle de message.
- **Règle** : suppression en base **uniquement** pour le message ciblé, et **seul l’auteur** peut supprimer (`.eq("user_id", user.id)`).
- **Effet** : la ligne est supprimée de la table `messages`. Pas de lien avec « lu » ou « non lu ».

---

### 2. Disparition après lecture (filtrage à l’affichage, pas de DELETE)

- **Où** : `lib/supabase/CRUD/messages/getMessages/getMessages.ts` (paramètre `options?: GetMessagesVisibilityOptions`).
- **Règle** : on ne supprime rien en base. Lors du **chargement** des messages, on **exclut** de la liste renvoyée ceux qui sont considérés comme « expirés » pour l’utilisateur qui charge (**currentUserId**).

Critère d’exclusion dans `getMessages` :

- On charge les `read_at` pour **tous** les messages de la conversation **pour l’utilisateur courant** (`options.currentUserId`).
- Pour chaque message :
  - s’il n’a **pas** de `read_at` pour cet utilisateur → on **garde** le message ;
  - s’il a un `read_at` pour cet utilisateur → on garde seulement si `read_at + disappearAfterMinutes > now`, sinon on **exclut** (le message « disparaît » pour cet utilisateur).

Donc : **sont masqués uniquement les messages que l’utilisateur courant a lus et dont le délai « disparition » est dépassé.**  
Aucune suppression en base, aucun critère « lu par l’autre » dans cette logique.

---

## Qui écrit dans `message_reads` ?

- **Où** : `useThreadWithCache` appelle `markMessagesAsReadAction(ids)`.
- **Quels messages** : uniquement ceux **envoyés par l’autre** :  
  `ids = content.messages.filter((m) => m.senderId !== content.currentUserId).map((m) => m.id)`.
- Donc on insère un `read_at` **pour l’utilisateur qui consulte**, sur les **messages reçus** (de l’autre).

Conséquence :

- Les **messages que j’ai reçus** (envoyés par l’autre) ont un `read_at` **pour moi** quand j’ai ouvert la conversation.
- Les **messages que j’ai envoyés** ne sont **jamais** marqués comme lus **par moi** (on ne marque pas ses propres messages).

---

## Comportement actuel « disparition »

Pour **moi** (utilisateur qui charge le thread avec `currentUserId = moi`) :

- **Messages de l’autre** :
  - J’ai un `read_at` dessus (dès que j’ai ouvert la conversation).
  - Ils « disparaissent » pour moi après `disappearAfterMinutes` à partir de **mon** `read_at`.
- **Mes propres messages** :
  - Pas de `read_at` pour moi en base.
  - Donc **jamais exclus** par le filtre → ils **ne disparaissent jamais** pour moi.

Résumé : aujourd’hui, on n’« efface » (masque) que **les messages que moi, en tant que lecteur, j’ai lus** et dont le délai est dépassé. Ce sont en pratique **uniquement les messages reçus** (de l’autre), car ce sont les seuls qu’on marque comme lus. Les miens restent toujours visibles pour moi.

Formulation équivalente : **on ne fait « disparaître » que les messages qui ont été lus par l’utilisateur qui les a reçus (moi), i.e. les messages de l’autre.** Donc « n’efface que les messages lus [par moi, donc les messages de l’autre] » est cohérent avec le code actuel.

---

## Si tu veux « effacer tous les messages » (y compris les miens)

Deux interprétations possibles :

### A. Disparition aussi pour **mes** messages, une fois **l’autre** les a lus

- **Règle** : pour les messages **dont je suis l’auteur**, les faire disparaître **pour moi** quand **l’autre** les a lus et que `read_at_autre + disappearAfterMinutes` est dépassé.
- **Changement** : dans `getMessages`, pour chaque message :
  - si le message est **de moi** (`user_id === currentUserId`) : utiliser le `read_at` **de l’autre** (celui qui a reçu le message), pas le mien, pour appliquer le délai de disparition et éventuellement exclure le message pour moi.
- **Implique** : connaître « l’autre » (participant de la conversation) et appeler `getReadAtByMessageIds(messageIds, otherUserId)` pour les messages dont je suis l’auteur, puis appliquer le même critère `read_at + disappearAfterMinutes <= now` pour les exclure.

### B. Suppression réelle en base après lecture par l’autre

- **Règle** : quand l’autre marque un message comme lu et que le délai est passé, **supprimer** la ligne dans `messages` (et probablement dans `message_reads`).
- **Implique** : un job / trigger / edge function qui fait un `DELETE` sur `messages` selon `message_reads` et le délai, ou une logique côté app à chaque « marquer comme lu » qui supprime les messages éligibles. Plus lourd et moins réversible.

---

## Fichiers clés

| Fichier                                                                             | Rôle                                                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `lib/supabase/CRUD/messages/deleteMessage/deleteMessage.ts`                         | Suppression explicite (un message, par son auteur).                                                     |
| `lib/supabase/CRUD/messages/getMessages/getMessages.ts`                             | Chargement des messages + filtre « disparition » selon `currentUserId` et `read_at` (pour ce user).     |
| `lib/supabase/CRUD/messageReads/getReadAtByMessageIds/getReadAtByMessageIds.ts`     | Récupère les `read_at` par message pour **un** utilisateur.                                             |
| `lib/hooks/messages/useThreadWithCache/useThreadWithCache.ts`                       | Marque comme lus les messages **de l’autre** (`senderId !== currentUserId`).                            |
| `features/messages/data/getConversationWithMessages/getConversationWithMessages.ts` | Appelle `getMessages` avec `currentUserId` = utilisateur connecté et `disappearAfterMinutes` du profil. |

---

## Résumé une phrase

Aujourd’hui : **aucun DELETE automatique** ; seuls les **messages que l’utilisateur courant a lus** (en pratique ceux reçus de l’autre) **disparaissent pour lui** après X minutes. Les messages qu’il a envoyés ne disparaissent jamais pour lui. Pour faire disparaître aussi « tous » les messages (y compris les siens) côté affichage, il faut étendre le filtre dans `getMessages` en utilisant le `read_at` **de l’autre** pour les messages dont je suis l’auteur (option A ci‑dessus).
