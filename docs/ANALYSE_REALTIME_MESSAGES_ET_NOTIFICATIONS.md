# Analyse : Realtime messages vs badge notification sur la nav

## Ce qui fonctionne aujourd’hui

### Mise à jour en temps réel dans le flux Messages (liste + room)

- **Où** : uniquement quand tu es sur une page du flux Messages (`/messages` ou `/messages/[id]`).
- **Comment** :
  - `useMessagesRealtime` est monté dans :
    - `useMessagesView` (liste → `/messages`)
    - `ThreadRealtime` (conversation → `/messages/[id]`)
  - Il s’abonne à Supabase Realtime (`postgres_changes`) sur les tables `messages` et `conversations`.
  - Sur **INSERT** message : il appelle `mutate(MESSAGES_LIST_KEY)` (rafraîchit la liste) et/ou met à jour le cache SWR du thread (nouveau message dans la room).
- **Résultat** : la liste se met à jour (dernier message, style “unread”), et la room affiche le nouveau message tout de suite (d’où le changement de fond / feedback visuel qui marche).

---

## Ce qui ne fonctionne pas en temps réel

### Badge / “notification” au-dessus de l’entrée Messages dans la nav

- **Comportement actuel** :
  - Le badge ne se met à jour **quand tu es déjà sur la page Messages** (ou dans certains cas sur Notifications), pas quand tu es sur Accueil, Calendrier, etc.
- **Pourquoi** : deux logiques différentes, et la nav ne consomme pas encore le bon flux.

---

## Les deux logiques (et pourquoi elles ne sont pas les mêmes)

### 1. Realtime “nouveau message” (table `messages`)

- **Source** : abonnement Supabase Realtime sur la table **`messages`** (et `conversations`).
- **Où c’est utilisé** : dans `useMessagesRealtime`, qui n’est monté **que** dans les pages Messages (liste + conversation).
- **Effet** : mise à jour du cache SWR (liste des conversations, messages du thread) → la liste et la room se mettent à jour en temps réel.
- **Limite** : dès que tu quittes le flux Messages (Accueil, Calendrier, Notifications), ce hook est démonté → **plus aucun abonnement sur `messages`**. Donc aucun événement “nouveau message” n’est reçu quand tu n’es pas sur Messages.

### 2. Badge “notifications” / nombre de messages non lus

- **Source du nombre** : **pas** la table `notifications`, mais **`getUnreadCountForCurrentUser()`** (dans `lib/supabase/CRUD/notifications/`).
  - Cette fonction compte les **messages non lus** : messages reçus par l’utilisateur (dans ses conversations) qui n’ont pas encore de `read_at` pour lui.
  - Donc : même “concept” que les messages (messages non lus), mais **calculé côté serveur** via une requête, pas via une table dédiée “notifications”.
- **Où c’est utilisé** :
  - `getNotificationsBadgeAction()` appelle `getUnreadCountForCurrentUser()` et renvoie ce `count`.
  - `NotificationsContext` :
    - Au **mount** : un seul `getNotificationsBadgeAction()` → mise à jour de `unreadCount`.
    - Ensuite, `unreadCount` n’est mis à jour que quand **`NotificationsView`** appelle `setUnreadCount(getUnreadCount(notifications))`, c’est-à-dire **uniquement quand tu es sur la page Notifications** et que la liste des notifications change (fetch côté serveur).
- **Résultat** :
  - Pas d’abonnement Realtime dédié au “nombre de messages non lus”.
  - Le badge (si on l’affichait) ne bougerait qu’au chargement initial et en allant sur la page Notifications, **pas** à la réception d’un nouveau message quand tu es sur une autre page.

En résumé :

- **Realtime messages** = abonnement `postgres_changes` sur `messages` → met à jour la liste et la room, **seulement** quand tu es sur Messages.
- **Badge “notification”** = count = “messages non lus” via `getUnreadCountForCurrentUser()`, **sans** Realtime ; mis à jour au mount et sur la page Notifications, **pas** à la réception d’un nouveau message sur les autres pages.

Donc la logique “nouveau message en room” et la logique “badge au-dessus de la nav Messages” ne sont pas les mêmes : l’une est en Realtime (table `messages`), l’autre est un count serveur recalculé à la demande, sans Realtime.

---

## Nav actuelle

- `AppNav` affiche `mainNavItems` avec `item.badge`.
- Dans `lib/navigation/navigation.ts`, tous les items ont **`badge: null`** (y compris Messages).
- Le **contexte** expose `unreadCount` (et `setUnreadCount`) mais **aucun composant ne branche ce count sur le badge de l’entrée “Messages”** dans la nav.
- Donc même si le count était à jour, le badge sur “Messages” n’est pas affiché pour l’instant.

---

## Synthèse

| Besoin                                          | Source actuelle                                             | Realtime ?                                                 | Où ça s’active                                              |
| ----------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| Liste + room à jour (fond, nouveau message)     | `useMessagesRealtime` → `messages`                          | Oui                                                        | Uniquement quand on est sur `/messages` ou `/messages/[id]` |
| Badge “X nouveaux messages” sur la nav Messages | `getUnreadCountForCurrentUser()` via `NotificationsContext` | Non (fetch + mise à jour seulement sur page Notifications) | Mount + page Notifications                                  |
| Affichage du badge sur l’icône Messages         | —                                                           | —                                                          | Pas branché (badge = null dans la nav)                      |

Pour que le badge au-dessus de “Messages” se mette à jour **en temps réel** dès qu’il y a un nouveau message (même sur Accueil / Calendrier / Notifications), il faudrait :

1. **Une source Realtime globale** pour “nouveau message reçu pour moi” :
   - soit un abonnement Realtime sur `messages` monté **au niveau root** (layout / provider), qui écoute les INSERT et déclenche un refetch du count (ou une incrémentation) puis `setUnreadCount`,
   - soit une table / un canal dédié “notifications” alimenté à chaque nouveau message et auquel le client s’abonne en Realtime (là tu aurais vraiment “logique notification” = table `notifications` + Realtime).

2. **Brancher le count sur la nav** : utiliser `useNotificationsUnreadCount()` (ou équivalent) dans la nav pour passer ce count au `badge` de l’entrée “Messages”, afin que le badge s’affiche et se mette à jour dès que `unreadCount` change (y compris après le Realtime ci‑dessus).

---

## Fichiers clés

- Realtime messages : `lib/hooks/messages/useMessagesRealtime/useMessagesRealtime.ts`
- Utilisation : `lib/hooks/messages/useMessagesView/useMessagesView.ts`, `features/messages/components/messageId/ThreadRealtime/ThreadRealtime.tsx`
- Count “unread” : `lib/supabase/CRUD/notifications/getUnreadCountForCurrentUser/getUnreadCountForCurrentUser.ts`
- Badge action : `features/notifications/actions/getNotificationsBadgeAction/getNotificationsBadgeAction.ts`
- Contexte : `lib/contexts/NotificationsContext/NotificationsContext.tsx`
- Mise à jour du count depuis la page Notifications : `features/notifications/components/NotificationsView/NotificationsView.tsx` (`setUnreadCount(getUnreadCount(notifications))`)
- Nav : `components/layout/AppNav/AppNav.tsx`, `lib/navigation/navigation.ts`
