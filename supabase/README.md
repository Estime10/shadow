# Migrations Supabase

Les scripts SQL doivent être exécutés **dans l’ordre** ci-dessous (SQL Editor du dashboard Supabase ou outil de migration).

## Ordre d’exécution

| Ordre | Fichier                                     | Rôle                                                                                               |
| ----- | ------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1     | `001_schema.sql`                            | Tables `users`, `messages`, `events` + trigger inscription                                         |
| 2     | `002_rls.sql`                               | RLS de base (users, messages, events)                                                              |
| 3     | `003_indexes_foreign_keys.sql`              | Index et clés étrangères                                                                           |
| 4     | `004_conversations.sql`                     | Table `conversations`, colonne `conversation_id` sur `messages`, **RLS messages par conversation** |
| 5     | `005_message_reads.sql`                     | Lecture des messages                                                                               |
| 6     | `006_user_message_settings.sql`             | Paramètres utilisateur                                                                             |
| 7     | `007_groups.sql`                            | Groupes                                                                                            |
| 8     | `008_conversations_type_and_group.sql`      | Type de conversation et groupes                                                                    |
| 9     | `010_message_reads_select_conversation.sql` | RLS message_reads par conversation                                                                 |
| 10    | `011_groups_select_creator.sql`             | RLS groupes                                                                                        |
| 11    | `012_groups_rls_no_recursion.sql`           | RLS groupes (sans récursion)                                                                       |

Fichier à part (calendrier) :

- `events_table_and_rls.sql` — à utiliser si la table `events` et son RLS ne sont pas déjà créés via 001 + 002.

## Point critique : `004_conversations.sql`

**004_conversations.sql** remplace les policies RLS sur `messages` définies dans 002 :

- En **002**, `messages_select_authenticated` autorise la lecture de **tous** les messages (`using (true)`).
- En **004**, la même policy est recréée pour limiter la lecture aux messages dont la conversation appartient à l’utilisateur (`conversation_id` + `conversations.user_1_id` / `user_2_id`).

Sans exécuter **004**, les messages ne sont pas protégés par conversation : tout utilisateur authentifié pourrait lire tous les messages. Il est donc **obligatoire** d’exécuter **004** après 002/003 pour une app de messagerie sécurisée.
