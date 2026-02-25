# Conventions composants

## Structure : orchestrateur + sous-dossiers

**Règle pour TOUS les composants :**

- **Fichier principal (orchestrateur)** : reste à la **racine** du dossier du composant.
  - Un seul fichier : `NomDuComposant.tsx` (ou `NomDuComposant/NomDuComposant.tsx` selon la structure existante).
  - Rôle : orchestration, état, composition des sous-composants.

- **Sous-composants** : chacun dans **son propre sous-dossier**.
  - Structure : `NomDuComposant/SousComposant/SousComposant.tsx` uniquement (pas d'index dans les sous-dossiers).
  - Les sous-composants ne vivent pas en fichiers plats à côté de l’orchestrateur.

### Exemple (MessageBubble)

```
MessageBubble/
├── MessageBubble.tsx          ← orchestrateur (racine)
├── index.ts                   ← export public
├── MessageBubbleContent/
│   └── MessageBubbleContent.tsx
├── MessageBubbleEditForm/
│   └── MessageBubbleEditForm.tsx
├── MessageBubbleFooter/
│   └── MessageBubbleFooter.tsx
├── MessageBubbleMenu/
│   └── MessageBubbleMenu.tsx
└── MessageBubbleView/
    └── MessageBubbleView.tsx
```

### Imports dans l’orchestrateur

```ts
import { MessageBubbleView } from "./MessageBubbleView/MessageBubbleView";
import { MessageBubbleEditForm } from "./MessageBubbleEditForm/MessageBubbleEditForm";
```

Pas d'index dans les sous-dossiers : on importe directement le fichier du composant.
