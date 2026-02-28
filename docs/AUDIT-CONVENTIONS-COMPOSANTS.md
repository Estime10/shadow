# Audit conventions composants

Dernière analyse : respect de la structure **orchestrateur à la racine + sous-composants en sous-dossiers (sans index)**.

## Règle

- **Orchestrateur** : fichier principal à la **racine** du dossier du composant (`NomComposant/NomComposant.tsx`), pas dans un sous-dossier du même nom.
- **Sous-composants** : chacun dans `NomComposant/SousComposant/SousComposant.tsx`. **Pas d’index** dans les sous-dossiers ; import direct du `.tsx`.

## État après correction

| Composant                               | Structure                                                                                                  | Statut                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **MessageBubble**                       | `MessageBubble.tsx` à la racine + `MessageBubbleContent/`, `MessageBubbleEditForm/`, etc. (sans index)     | OK                                                                       |
| **ConversationEmptyState**              | `ConversationEmptyState.tsx` à la racine + `CreateConversationModal/`, `useCreateConversationModal/`, etc. | OK (corrigé : était en `ConversationEmptyState/ConversationEmptyState/`) |
| **MessagesList**                        | `MessagesList.tsx` à la racine + `ConversationsEmptyCard/`                                                 | OK (corrigé : était en `MessagesList/MessagesList/`)                     |
| **MessagesView**                        | `MessagesView/MessagesView.tsx` (un seul fichier, pas de sous-composants)                                  | OK                                                                       |
| **MessageIdContent**                    | `MessageIdContent/MessageIdContent.tsx`                                                                    | OK                                                                       |
| **MessageInput**                        | `MessageInput/MessageInput.tsx`                                                                            | OK                                                                       |
| **MessageIdHeader**                     | `MessageIdHeader/MessageIdHeader.tsx`                                                                      | OK                                                                       |
| **MessageThread**                       | `MessageThread/MessageThread.tsx`                                                                          | OK                                                                       |
| **MessagesContent**                     | `MessagesContent/MessagesContent.tsx`                                                                      | OK                                                                       |
| **MessagesHeader**                      | `MessagesHeader/MessagesHeader.tsx`                                                                        | OK                                                                       |
| **ConversationListItem**                | `ConversationListItem/ConversationListItem.tsx`                                                            | OK                                                                       |
| **CreateConversationModal**             | sous-composant de ConversationEmptyState, dans `CreateConversationModal/CreateConversationModal.tsx`       | OK                                                                       |
| **ConversationsEmptyCard**              | sous-composant de MessagesList, dans `ConversationsEmptyCard/ConversationsEmptyCard.tsx`                   | OK                                                                       |
| **LoginForm** / **RegisterForm** (auth) | `LoginForm/LoginForm.tsx`, `RegisterForm/RegisterForm.tsx`                                                 | OK                                                                       |

## Index conservés (hors sous-dossiers de composants)

- `features/messages/actions/index.ts` – ré-export des actions
- `features/messages/data/index.ts` – ré-export des fonctions data
- `features/messages/types/index.ts` – ré-export des types
- `features/messages/utils/index.ts` – ré-export des utils
- `lib/hooks/messages/` – hooks messages (useClientUserId, useFilteredOtherProfiles, useMessagesRealtime)
- `features/messages/components/index.ts` – ré-export des composants (point d’entrée feature)
- `features/messages/components/messages/ConversationEmptyState/index.ts` – ré-export de l’orchestrateur (pour `from "../ConversationEmptyState"`)
- `features/messages/components/messages/MessagesList/index.ts` – idem
- `features/messages/components/messageId/MessageBubble/index.ts` – idem

Ces index sont au niveau **dossier de composant** ou **feature**, pas dans chaque sous-dossier de sous-composant.
