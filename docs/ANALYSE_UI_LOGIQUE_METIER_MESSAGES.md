# Analyse UI / logique métier — feature messages

## Objectif

Séparer la logique métier des composants UI : les composants ne font que rendu et délèguent les actions à des hooks ou à des callbacks fournis par le parent.

## Fichiers analysés et traités

### 1. MessageInputForm (refactoré)

- **Avant** : upload Storage, construction FormData, logger, appel handleSubmit directement dans le composant.
- **Après** :
  - **useAttachMedia** (nouveau hook) : `handleAttachClick`, `handleFileChange`, appel à `uploadMessageMediaToStorage`, construction du FormData, `onSubmitWithMedia(formData)`.
  - **MessageInputForm** : uniquement rendu (form, textarea, file input, boutons) + `useMessageSubmit` + `useAttachMedia(conversationId, handleSubmit)`.

### 2. MessageBubbleEditForm (refactoré)

- **Avant** : `action={async (formData) => updateMessageAction + mutate + onCancel}` et constante `MESSAGES_LIST_KEY` dans le fichier.
- **Après** :
  - **useMessageBubbleEditForm** (nouveau hook) : `handleSubmit(formData)` qui appelle `updateMessageAction`, puis `mutate` + `onCancel` en cas de succès.
  - **MessageBubbleEditForm** : état local `editText` (UI), formulaire avec `action={handleSubmit}`.

### 3. Constantes partagées

- **MESSAGES_LIST_KEY** et **ACCEPT_IMAGES** déplacés dans `features/messages/constants`.
- **useMessageSubmit** et **useMessageBubbleMenuConfirm** utilisent `MESSAGES_LIST_KEY` importé depuis les constantes.

## Fichiers déjà propres (pas de logique métier dans l’UI)

- **ConversationEmptyState** : délègue à `useConversationEmptyState` et `useCreateConversationModal`.
- **CreateGroupModal** : délègue à `useCreateGroupModal`.
- **MessageBubbleMenu** : délègue à `useMessageBubbleMenuConfirm` (suppression).
- **ThreadRealtime** : délègue à `useMessagesRealtime`.
- **MessageBubble**, **MessageBubbleView**, **MessageBubbleFooter** : état UI (menu open, édition) et callbacks passés en props.
- **MessageBubbleMenuList**, **MessageBubbleFooterMenu** : uniquement rendu + callbacks.
- **MessagesHeader** : rendu + `onDisappearSettingChange` fourni par le parent (logique côté page ou hook parent).
- **CreateConversationModal**, **CreateGroupModalView** : présentiels, props reçues du parent ou de hooks.

## Règle appliquée

- **Composant UI** : pas d’appel direct à une action (createMessageAction, updateMessageAction, uploadMessageMediaToStorage), pas de construction de FormData métier, pas de constante métier dupliquée. Au plus : état purement UI (focus, open menu, valeur champ) et callbacks/hooks.
- **Hook** : orchestration (appel actions, mutate SWR, logger), exposée via des callbacks (ex. `handleSubmit`, `handleFileChange`).
