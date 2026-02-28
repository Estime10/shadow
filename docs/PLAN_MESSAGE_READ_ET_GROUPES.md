# Plan : Messages lus (read) + Conversations de groupe

Document de conception avant implémentation. Objectifs :

1. **Messages lus** : table pour tracer qui a lu quel message ; affichage "Lu" côté UI ; disparition du message pour le lecteur après un délai configurable (15 / 30 / 45 / 60 min) **pour ce lecteur uniquement**.
2. **Conversations de groupe** : une conversation peut être soit **directe** (1:1, comme aujourd’hui) soit **groupe** (N participants). Liste des conversations : pour un groupe on affiche le **nom du groupe** (éditable par le créateur) et un **avatar = initiale(s) du nom du groupe**.

---

## 1. Messages lus (read)

### 1.1 Logique métier

- **Qui a lu** : on enregistre **par utilisateur** qu’il a lu un message à un instant `read_at`.
- **Disparition** : pour l’utilisateur qui a lu, le message **disparaît de sa vue** après un délai **X minutes** à partir de `read_at`. X ∈ { 15, 30, 45, 60 }, choisi par l’utilisateur dans les **paramètres de la page Messages** (voir § 1.4).
- Le message **reste en base** jusqu’à son `expires_at` habituel (ex. 24h après création) ; on ne supprime pas la ligne pour les autres participants.
- **UI** : pour le message, afficher un indicateur **"Lu"** (ou équivalent) **pour l’utilisateur connecté** quand il a lu ce message (et tant que le message est encore visible pour lui, i.e. avant `read_at + X min`).

### 1.2 Nouvelle table : `message_reads`

| Colonne      | Type        | Contrainte                                    | Description          |
| ------------ | ----------- | --------------------------------------------- | -------------------- |
| `id`         | uuid        | PK, default gen_random_uuid()                 |                      |
| `message_id` | uuid        | NOT NULL, FK → messages(id) ON DELETE CASCADE |                      |
| `user_id`    | uuid        | NOT NULL, FK → users(id) ON DELETE CASCADE    | Utilisateur qui a lu |
| `read_at`    | timestamptz | NOT NULL DEFAULT now()                        | Moment de la lecture |

- Contrainte d’unicité : **UNIQUE (message_id, user_id)** — une seule entrée “lu” par (message, utilisateur).
- Index : `(user_id, read_at)`, `(message_id)` pour les jointures et les filtres “messages encore visibles pour user après read”.

### 1.3 Règles de visibilité côté app

Pour l’utilisateur courant `current_user_id` et un délai “disparition après lecture” `disappear_after_minutes` :

- **Afficher le message** si :
  - `messages.expires_at` est null ou > now() (expiration 24h classique), **et**
  - soit il n’existe **pas** de ligne dans `message_reads` pour `(message_id, current_user_id)`,
  - soit il en existe une avec `read_at + disappear_after_minutes > now()`.
- **Ne plus afficher** (disparu pour ce user) si une ligne existe et `read_at + disappear_after_minutes <= now()`.
- **Afficher “Lu”** sur le message si une ligne existe pour `(message_id, current_user_id)` et que le message est encore visible (même condition qu’au-dessus).

### 1.4 Réglage “disparition après lecture” : paramètres Messages

- **Stockage** : préférence **par utilisateur** — table `user_settings` ou colonne sur `users` (ex. `message_disappear_after_minutes`), valeurs autorisées : **15, 30, 45, 60** (minutes).
- **UI** : dans la **page Messages**, un bloc **Paramètres** (ou icône engrenage / settings) avec une **dropdown** pour choisir le délai avant disparition du message après lecture :
  - **15 min**
  - **30 min**
  - **45 min**
  - **60 min**
- Valeur par défaut si non renseignée : à définir (ex. 30 min).
- C’est le réglage le plus simple et le plus efficace pour l’utilisateur : tout se fait au même endroit (Messages).

### 1.5 RLS `message_reads`

- **SELECT** : utilisateur authentifié peut voir uniquement ses propres lignes (`user_id = auth.uid()`).
- **INSERT** : uniquement pour soi (`user_id = auth.uid()`), et uniquement si l’utilisateur a le droit de voir la conversation (même règle que pour `messages`).
- Pas d’UPDATE ni DELETE nécessaires si on considère qu’un “lu” est définitif.

### 1.6 Résumé “Messages lus”

| Élément     | Décision                                                                                              |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| Table       | `message_reads (id, message_id, user_id, read_at)`                                                    |
| Unicité     | Un enregistrement par (message, user)                                                                 |
| Disparition | Pour le lecteur uniquement, après X min depuis `read_at` (X = 15/30/45/60)                            |
| UI          | Texte “Lu” pour l’utilisateur connecté quand il a lu le message (et qu’il est encore visible)         |
| Réglage X   | Paramètres de la page Messages : dropdown (15 / 30 / 45 / 60 min), préférence stockée par utilisateur |

---

## 2. Conversations de groupe

### 2.1 Logique métier

- **Deux types de conversation** :
  - **Directe** : comme aujourd’hui, 2 users (`user_1_id`, `user_2_id`). Affichage : username de l’autre user, avatar = initiale du username.
  - **Groupe** : N users. Affichage : **nom du groupe** (par défaut ex. “Groupe chat”, modifiable par le **créateur**), avatar = **initiale(s) du nom du groupe**.
- Le créateur du groupe est le user qui a créé la conversation de type groupe ; lui seul peut **mettre à jour le nom du groupe** (pour l’instant pas d’admin multiples).

### 2.2 Modèle de données

#### 2.2.1 Type de conversation

- Introduire un **type** sur la conversation : `direct` | `group`.
- **Direct** : on garde `user_1_id` et `user_2_id` (contrainte user_1 < user_2), `group_id` = NULL.
- **Groupe** : `group_id` renseigné, `user_1_id` et `user_2_id` = NULL (ou on garde une seule table “conversations” avec colonnes nullable selon le type).

#### 2.2.2 Tables proposées

**Table `conversation_type` (enum ou table de référence)**

- On peut utiliser un **enum** PostgreSQL : `conversation_type_enum AS ENUM ('direct', 'group')`.

**Table `conversations` (évolution)**

| Colonne      | Actuel        | Après évolution                                  | Notes                                |
| ------------ | ------------- | ------------------------------------------------ | ------------------------------------ |
| `id`         | uuid PK       | inchangé                                         |                                      |
| `type`       | —             | conversation_type_enum NOT NULL DEFAULT 'direct' | 'direct' ou 'group'                  |
| `user_1_id`  | uuid NOT NULL | uuid NULL                                        | Rempli uniquement si type = 'direct' |
| `user_2_id`  | uuid NOT NULL | uuid NULL                                        | Rempli uniquement si type = 'direct' |
| `group_id`   | —             | uuid NULL, FK → groups(id)                       | Rempli uniquement si type = 'group'  |
| `created_at` | timestamptz   | inchangé                                         |                                      |

Contraintes :

- Si `type = 'direct'` : `user_1_id` et `user_2_id` NOT NULL, `group_id` NULL, et user_1 < user_2.
- Si `type = 'group'` : `group_id` NOT NULL, `user_1_id` et `user_2_id` NULL.

**Table `groups`**

| Colonne              | Type        | Contrainte                    | Description                                          |
| -------------------- | ----------- | ----------------------------- | ---------------------------------------------------- |
| `id`                 | uuid        | PK, default gen_random_uuid() |                                                      |
| `name`               | text        | NOT NULL                      | Nom affiché (ex. “Groupe chat”, ou nom personnalisé) |
| `created_by_user_id` | uuid        | NOT NULL, FK → users(id)      | Créateur ; seul à pouvoir modifier `name`            |
| `created_at`         | timestamptz | NOT NULL DEFAULT now()        |                                                      |

**Table `group_members`**

| Colonne     | Type        | Contrainte                                  | Description      |
| ----------- | ----------- | ------------------------------------------- | ---------------- |
| `id`        | uuid        | PK, default gen_random_uuid()               |                  |
| `group_id`  | uuid        | NOT NULL, FK → groups(id) ON DELETE CASCADE |                  |
| `user_id`   | uuid        | NOT NULL, FK → users(id) ON DELETE CASCADE  | Membre du groupe |
| `joined_at` | timestamptz | NOT NULL DEFAULT now()                      | Optionnel        |

- **UNIQUE (group_id, user_id)** pour éviter les doublons.

Ordre de création logique : `groups` → `group_members` → `conversations` (avec `group_id` pour type 'group').

### 2.3 RLS et droits

- **Conversations**
  - **SELECT** :
    - si type = 'direct' : `user_1_id = auth.uid() OR user_2_id = auth.uid()` ;
    - si type = 'group' : `EXISTS (SELECT 1 FROM group_members WHERE group_id = conversations.group_id AND user_id = auth.uid())`.
  - **INSERT** : selon la règle métier (création directe 1:1 ou création de groupe + conversation + membres).
  - **DELETE** : à définir (ex. créateur du groupe ou tous les membres peuvent quitter / supprimer).

- **Groups**
  - **SELECT** : uniquement les membres du groupe (via `group_members`).
  - **UPDATE** : uniquement `created_by_user_id = auth.uid()` (pour modifier le nom).
  - **INSERT** : authentifié (création de groupe).
  - **DELETE** : à définir (ex. créateur seulement).

- **Group_members**
  - **SELECT** : si user est membre du groupe.
  - **INSERT** : créateur du groupe ou logique d’invitation à préciser.
  - **DELETE** : quitter le groupe (soi-même) ou créateur qui retire un membre, selon la règle choisie.

- **Messages** : adapter les politiques pour que, en groupe, tout membre du groupe puisse lire/écrire dans la conversation (remplacer la condition user_1_id / user_2_id par “membre de la conversation”, i.e. direct ou membre du group_id).

### 2.4 UI / affichage

- **Liste des conversations**
  - **Direct** : comme aujourd’hui — **username** de l’autre user, avatar = initiale du username.
  - **Groupe** : **nom du groupe** (champ `groups.name`), avatar = **initiale(s) du nom du groupe** (même logique que `getInitial` sur le nom).

- **Détail conversation (thread)**
  - Direct : inchangé.
  - Groupe : header avec nom du groupe ; pour le créateur, possibilité d’éditer le nom (champ + sauvegarde vers `groups.name`).

- **Création**
  - Création de conversation directe : inchangée (findOrCreate entre 2 users).
  - Création de groupe : nouveau flux (créer group + group_members + conversation type 'group').

### 2.5 Résumé “Groupes”

| Élément                   | Décision                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| Type conversation         | `direct` \| `group` (enum ou équivalent)                            |
| Table `groups`            | id, name, created_by_user_id, created_at                            |
| Table `group_members`     | group_id, user_id (UNIQUE), optionnel joined_at                     |
| Évolution `conversations` | type + group_id ; user_1_id / user_2_id nullables pour type 'group' |
| Affichage liste           | Direct = username ; Groupe = nom du groupe                          |
| Avatar liste              | Direct = initiale username ; Groupe = initiale(s) nom du groupe     |
| Édition nom groupe        | Uniquement par le créateur (created_by_user_id)                     |

---

## 3. Ordre d’implémentation suggéré

1. **Migrations SQL**
   - Créer l’enum `conversation_type` (si utilisé).
   - Créer `message_reads` + index + RLS.
   - Créer `groups` et `group_members` + RLS.
   - Faire évoluer `conversations` (type, group_id, nullability de user_1_id / user_2_id) + contraintes + RLS.
   - Adapter les RLS sur `messages` pour prendre en compte les conversations de type groupe (membres du groupe).

2. **Backend / CRUD**
   - Message read : fonctions pour insérer un “lu”, pour lister les messages en filtrant par visibilité (read_at + délai), et pour savoir si l’utilisateur courant a lu un message (pour l’UI “Lu”).
   - Groupes : CRUD groups, group_members, et création de conversation de type groupe ; mise à jour du nom du groupe (créateur uniquement).

3. **Frontend**
   - Messages lus : appel “marquer comme lu” à l’affichage du message ; indicateur “Lu” sur les messages ; filtrage des messages disparus (read_at + X min) côté liste / thread.
   - **Paramètres Messages** : bloc/écran paramètres sur la page Messages avec une **dropdown** pour sélectionner le délai avant disparition (15 / 30 / 45 / 60 min) ; sauvegarde de la préférence utilisateur (user_settings ou colonne users).
   - Groupes : liste des conversations avec distinction direct / groupe (nom + avatar) ; écran ou flow de création de groupe ; édition du nom du groupe (créateur).

---

## 4. Points à trancher avant ou pendant l’implémentation

- **Nom par défaut d’un nouveau groupe** : “Groupe chat” ou autre ?
- **Invitation / ajout de membres** : comment on ajoute des users à un groupe (recherche, lien, etc.) ?
- **Quitter / supprimer un groupe** : un membre peut-il quitter ; qui peut supprimer le groupe ou retirer un membre ?
- **Realtime** : s’assurer que les subscriptions (conversations, messages) prennent en compte les conversations de type groupe (membres) et, si besoin, les mises à jour de `message_reads` pour l’indicateur “Lu”.

Si ce plan te convient, la prochaine étape est de détailler les migrations SQL (fichiers dans `supabase/`) puis le CRUD et l’UI en suivant cet ordre.
