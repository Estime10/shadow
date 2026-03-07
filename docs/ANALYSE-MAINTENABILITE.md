# Analyse maintenabilité — Vue fullstack senior

**Objectif :** évaluer si le volume de fichiers et la structure nuisent à la maintenabilité, et proposer des optimisations ciblées sans tout casser.

---

## 1. Chiffres clés

| Zone           | Fichiers TS/TSX (hors tests) | Commentaire                  |
| -------------- | ---------------------------- | ---------------------------- |
| **app**        | 10                           | Routing / pages, raisonnable |
| **features**   | 158                          | > 50 % du code, attendu      |
| **lib**        | 71                           | CRUD, hooks, config, utils   |
| **components** | 36                           | UI partagée                  |
| **types**      | 10                           | Centralisés, bon             |
| **Total**      | **291**                      | Taille modérée pour une app  |

- **Profondeur :** 87 fichiers à au moins 4 niveaux de dossiers dans `features` (ex. `AddEventModal/AddEventForm/AddEventFormFields/AddEventFormTitleField/`).
- **Petits fichiers :** beaucoup de fichiers ≤ 20 lignes (index, réexports, micro-composants).
- **Gros fichiers :** aucun monolithe ; le plus long est `useMessagesRealtime.ts` (~278 lignes), ce qui reste acceptable.

**Verdict volume :** le nombre total de fichiers n’est pas excessif pour une app de cette taille. La maintenabilité est surtout impactée par **duplication** et **imbrication**, pas par le seul compteur de fichiers.

---

## 2. Points forts (à garder)

- **Séparation claire** : app / features / lib / components / types, avec rôles documentés (ARCHITECTURE, DOCUMENTATION).
- **Types centralisés** : un point d’entrée `@/types`, pas de types dispersés incohérents.
- **Pas de gros blobs** : pas de fichiers de 500+ lignes ; responsabilités relativement découpées.
- **Conventions explicites** : CONVENTIONS-COMPOSANTS (orchestrateur + sous-dossiers), index = réexports uniquement.
- **Discoverabilité** : une action / un hook = un dossier ou fichier dédié, noms prévisibles.
- **Auth aligné sur le design system** : LoginForm / RegisterForm utilisent le composant UI `Input` partagé.

---

## 3. Problèmes identifiés et optimisations

### 3.1 Duplication des styles de champs (calendrier)

**Constat :** Les formulaires calendrier (création + détail d’événement) ne réutilisent pas le composant `Input` de `components/ui`. Ils déclarent en dur les mêmes classes dans 6 fichiers :

- `AddEventFormTitleField`, `AddEventFormDescriptionField`, `AddEventFormTimeField`
- `EventDetailModalFormTitleField`, `EventDetailModalFormDescriptionField`, `EventDetailModalFormTimeField`

Exemple répété partout :

```ts
const labelClass =
  "block font-display text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-1";
const inputClass = "w-full rounded-lg border-2 ...";
```

**Impact :** divergence possible avec le design system, correction en 6 endroits pour un même changement visuel.

**Recommandation (priorité haute) :**

1. Utiliser `@/components/ui/Input` pour les champs texte (titre, description) du calendrier, **ou**
2. Introduire un composant partagé `EventFormField` (label + input/textarea) dans `features/calendar/components` ou `components/ui`, avec les styles dans un seul fichier.

Cela réduit la duplication et aligne le calendrier sur l’auth (même primitive pour les champs).

---

### 3.2 Doublon AddEvent vs EventDetailModal (champs)

**Constat :** Deux jeux de champs quasi identiques :

- **AddEvent** : titre, heure, description (création).
- **EventDetailModal** : titre, heure, description (édition).

Même sémantique (value + onChange), même rendu (label + input/textarea/time). Seule différence : contexte (création vs édition) et éventuellement libellés.

**Recommandation (priorité haute) :**

- Extraire **un seul jeu** de champs réutilisables, par exemple dans `features/calendar/components/EventFormFields/` :
  - `EventFormTitleField.tsx`
  - `EventFormDescriptionField.tsx`
  - `EventFormTimeField.tsx`
- Les utiliser à la fois dans `AddEventFormFields` et dans `EventDetailModalFormFields`.
- Supprimer les 6 dossiers dédiés (AddEventFormTitleField, EventDetailModalFormTitleField, etc.).

**Gain :** moins de fichiers, une seule source de vérité pour le rendu des champs événement, maintenance plus simple.

---

### 3.3 Un dossier par micro-composant (profondeur)

**Constat :** La règle “un sous-composant = son propre sous-dossier” donne des chemins très longs pour des composants très petits. Exemple :

```
AddEventModal/AddEventForm/AddEventFormFields/AddEventFormTitleField/AddEventFormTitleField.tsx  (≈ 25 lignes)
```

Pour des champs de formulaire sans logique métier, 1 dossier = 1 fichier peut sembler lourd.

**Recommandation (nuancée) :**

- **Ne pas généraliser** la fusion de tous les sous-composants : pour des blocs avec logique (MessageBubble, EventDetailModal, etc.), le découpage actuel reste pertinent.
- **Exception ciblée :** pour les champs de formulaire “étiquettes + input” (comme en 3.2), les regrouper dans un seul dossier `EventFormFields/` avec 3 fichiers (Title, Description, Time) ou même un seul fichier `EventFormFields.tsx` avec 3 composants internes si ils restent petits.
- Documenter dans CONVENTIONS-COMPOSANTS : “Les sous-composants purement présentationnels et très petits (ex. champs de formulaire) peuvent vivre dans un même dossier ou fichier au lieu d’un dossier par composant.”

Cela limite la profondeur sans remettre en cause la structure globale.

---

### 3.4 Index et réexports

**Constat :** ~25 fichiers `index.ts` qui ne font que réexporter. C’est cohérent avec l’architecture (point d’entrée par feature/module).

**Recommandation :** pas de changement structurel. Les index améliorent les imports (`@/features/calendar` au lieu de chemins longs). Le coût en nombre de fichiers est faible et acceptable.

---

### 3.5 CRUD : un dossier par fonction

**Constat :** Dans `lib/supabase/CRUD`, une fonction = un dossier (ex. `createEvent/createEvent.ts`). Environ 35 dossiers pour ~29 fichiers.

**Recommandation :** garder ce modèle. Chaque opération reste facile à trouver, et le nombre de dossiers n’est pas excessif. Passer à un seul fichier par domaine (ex. `events.ts` avec create/update/delete) réduirait les dossiers mais augmenterait la taille des fichiers et mélangerait plusieurs responsabilités. Le gain de maintenabilité n’est pas évident.

---

## 4. Synthèse et priorisation

| Action                                                                      | Priorité | Effort         | Impact                                           |
| --------------------------------------------------------------------------- | -------- | -------------- | ------------------------------------------------ |
| Unifier les champs événement (AddEvent + EventDetail) en un jeu partagé     | Haute    | Moyen          | Moins de duplication, un seul endroit à modifier |
| Aligner calendrier sur le design system (Input ou EventFormField partagé)   | Haute    | Faible / moyen | Cohérence UI, moins de styles dupliqués          |
| Autoriser (par convention) le regroupement de micro-composants (ex. champs) | Moyenne  | Faible         | Réduction de la profondeur sans tout refactorer  |
| Laisser index et structure CRUD tels quels                                  | —        | —              | Pas de changement                                |

---

## 5. Verdict maintenabilité

- **Structure globale :** saine et prévisible ; pas besoin de tout réorganiser.
- **Volume de fichiers :** raisonnable ; le problème n’est pas le nombre absolu mais la duplication et l’imbrication à certains endroits.
- **Leviers principaux :**
  1. unifier et partager les champs de formulaire calendrier ;
  2. utiliser une primitive commune (Input ou composant dédié) pour les styles ;
  3. assouplir la règle “un dossier par sous-composant” pour les tout petits composants (champs, etc.).

En appliquant les recommandations prioritaires (sections 3.1 et 3.2), on améliore la maintenabilité sans dégrader la lisibilité ni l’architecture actuelle.
