# Analyse des re-renders et revalidations — Messages

Document pour discuter des bonnes pratiques et des pistes d’optimisation concernant les re-renders et le rechargement des données dans la feature messages (et l’app en général).

---

## 1. État actuel

### 1.1 Où on déclenche un “refresh”

| Source                             | Mécanisme                                        | Cible                         |
| ---------------------------------- | ------------------------------------------------ | ----------------------------- |
| **Realtime** (useMessagesRealtime) | `router.refresh()`                               | Route courante                |
| **Après create message**           | revalidatePath + (optionnel) refresh côté client | `/messages`, `/messages/[id]` |
| **Après delete message**           | revalidatePath + `router.refresh()` (client)     | idem                          |
| **Après update message**           | revalidatePath + `router.refresh()` (client)     | idem                          |
| **Après create conversation**      | `router.replace()` (navigation)                  | pas de refresh explicite      |

**Realtime** appelle `router.refresh()` dans les cas suivants :

- INSERT conversation (si “mine”) → refresh
- DELETE conversation → refresh
- INSERT message (filtré par conversation) → refresh
- DELETE message → refresh
- UPDATE message → refresh

Donc **tout événement Realtime pertinent déclenche un refresh de la route entière**.

### 1.2 Ce que fait `router.refresh()` (Next.js App Router)

- Refait une requête serveur pour **la route courante**.
- Re-exécute **tous les Server Components** de cette route (et sous-routes concernées).
- Récupère le nouveau RSC payload et le fusionne côté client.
- **Préserve** : état client (useState), focus, scroll (en principe).

Conséquence pour nous :

- Sur **`/messages`** : refetch de `getConversationsForList()` + `getAllProfiles()` → tout le contenu liste est re-rendu à partir des nouvelles props.
- Sur **`/messages/[id]`** : refetch de `getConversationWithMessages(id)` → tout le thread (header + liste de messages) est re-rendu.

À chaque événement Realtime (nouveau message, message supprimé, etc.), on refait donc **toute** la requête serveur et tout le rendu Server Component de la page, pas seulement la partie impactée.

### 1.3 Ce que font les Server Actions

- **revalidatePath("/messages")** et **revalidatePath(`/messages/${conversationId}`)** invalident le cache Next.js pour ces chemins.
- Avec **`dynamic = "force-dynamic"`** sur les pages messages, les données ne sont de toute façon pas mises en cache longtemps ; l’invalidation sert surtout à cohérence pour les prochains rendus.
- Les composants client appellent en plus **`router.refresh()`** après succès (delete, update) pour mettre à jour l’UI tout de suite sans attendre une navigation.

---

## 2. Problèmes potentiels

### 2.1 Surcoût du refresh global

- **Liste** : un seul nouveau message (ou un delete/update) → refetch de **toutes** les conversations + **tous** les profils, puis re-render de toute la liste.
- **Thread** : un seul nouveau message (ou delete/update) → refetch de **toute** la conversation + **tous** les messages, puis re-render de tout le thread.

On ne met à jour que ce qui a changé ; on refait tout le segment de route.

### 2.2 Fréquence des événements Realtime

Si plusieurs événements arrivent vite (plusieurs messages, ou plusieurs utilisateurs), on peut enchaîner plusieurs `router.refresh()` rapprochés → plusieurs refetches serveur et re-renders complets.

### 2.3 Expérience utilisateur

- **Scroll** : en principe préservé par Next.js, mais un re-render complet de la liste de messages peut parfois impacter le scroll ou le focus.
- **Performance perçue** : refetch complet peut être plus lent qu’une mise à jour ciblée (un seul message ajouté en bas, par ex.).

---

## 3. Bonnes pratiques et alternatives

### 3.1 Ce qui est déjà sain

- **Pas de `window.location.reload`** : on utilise le router, donc pas de rechargement complet du document.
- **revalidatePath ciblé** : on invalide `/messages` et `/messages/[id]` selon le contexte, pas toute l’app.
- **`force-dynamic`** : pas de cache stale sur les pages messages ; les refetches ont du sens.
- **Un seul canal Realtime par user/contexte** : pas de multiplication des souscriptions qui doubleraient les refresh.

### 3.2 Pistes d’optimisation (à discuter)

#### A. Réduire la portée du refresh (idéal mais lourd)

- Next.js ne propose pas aujourd’hui un “refresh uniquement ce segment”.
- Pour “ne re-render que la liste des messages” sans refaire toute la page, il faudrait :
  - soit des **Client Components** qui fetchent leurs propres données (hooks + cache type SWR/React Query) et invalident uniquement la ressource “messages de cette conversation” ;
  - soit un **store client** (Zustand, etc.) alimenté par le serveur puis mis à jour par Realtime (push du nouveau message dans le store, pas de refetch).

Impact : moins de refetches serveur et re-renders limités à la liste de messages (ou à la liste de conversations), au prix d’une architecture différente (data côté client ou hybride).

#### B. Debounce des `router.refresh()` (Realtime)

- Si plusieurs événements Realtime arrivent en peu de temps, **debouncer** les appels à `router.refresh()` (ex. 200–300 ms).
- On garde un refresh “global”, mais on évite 5 refetches pour 5 messages reçus en 1 seconde.

Simple à ajouter dans `useMessagesRealtime`.

#### C. Optimistic updates (create / update / delete message)

- **Côté client** : après un create/update/delete réussi, mettre à jour l’UI immédiatement (ajouter le message en bas, modifier le texte, retirer la bulle) **sans** appeler `router.refresh()` tout de suite.
- La donnée “source de vérité” reste le serveur : au prochain refresh (ou à la prochaine navigation) les données sont cohérentes. Realtime peut encore déclencher un refresh pour les autres utilisateurs.

Réduit le nombre de refresh “inutiles” pour l’utilisateur qui vient d’agir.

#### D. Séparer “liste des conversations” et “thread”

- Aujourd’hui, sur `/messages`, une seule page Server Component charge **liste + empty state**.
- On pourrait :
  - garder le Realtime pour “nouvelle conversation” / “nouveau message” sur la liste, avec un refresh liste uniquement si on avait un moyen de ne refetch que ce bloc (voir A) ;
  - ou accepter le refresh global liste mais **debouncer** (B).

Même chose pour le thread : soit on accepte le refresh global, soit on passe la liste des messages en client + cache (A).

#### E. Garder l’approche actuelle en la documentant

- **Avantages** : simple, cohérent, pas de double source de vérité (serveur = référence). Realtime + refresh donne une UX “à jour” partout.
- **Inconvénients** : refetches et re-renders “larges” à chaque événement.
- Pour une app de taille moyenne et un volume d’événements raisonnable, cela peut rester acceptable ; le document sert alors à acter le choix et à prévoir un debounce (B) ou des optimistic updates (C) si besoin plus tard.

---

## 4. Recommandations proposées

1. **Court terme**
   - **Debouncer** les `router.refresh()` dans `useMessagesRealtime` (ex. 250 ms) pour éviter les rafales de refetches.
   - **Documenter** dans le code (ou ici) que “un refresh = re-render de tous les Server Components de la route”, pour que tout le monde ait le même modèle mental.

2. **Moyen terme (si la liste ou le thread deviennent lourds)**
   - Envisager **optimistic updates** sur create/update/delete message (mise à jour UI immédiate, refresh optionnel ou différé).
   - Envisager un **cache client** (SWR/React Query) pour la liste des messages d’un thread, avec invalidation ciblée et mise à jour via Realtime (push dans le cache) au lieu d’un refresh global.

3. **Architecture**
   - Rester sur **Server Components + revalidatePath + router.refresh()** comme base, et n’introduire du data fetching client que là où les métriques (perf, UX) le justifient.

---

## 5. Résumé

| Aspect                         | Actuel                            | Risque                           | Piste                                       |
| ------------------------------ | --------------------------------- | -------------------------------- | ------------------------------------------- |
| Realtime → refresh             | 1 refresh par événement           | Rafales si beaucoup d’événements | Debounce                                    |
| Actions (create/update/delete) | revalidatePath + router.refresh() | Refetch complet de la page       | Optimistic updates optionnels               |
| Portée du refresh              | Toute la route (tous les RSC)     | Surcoût si grosses listes        | À terme : data client + invalidation ciblée |
| Navigation                     | router.replace / router.push      | OK                               | —                                           |

Ce document peut servir de base pour une décision d’équipe (garder tel quel, ajouter debounce, planifier optimistic updates ou cache client) et pour l’évolution du module messages.
