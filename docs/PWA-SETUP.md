# Plan de mise en place PWA — Ghost Riders (Shade)

Ce document décrit les étapes pour transformer l’app en Progressive Web App (installable, offline-capable, app-like).

---

## Checklist globale

| #   | Tâche                              | Statut | Notes                                     |
| --- | ---------------------------------- | ------ | ----------------------------------------- |
| 1   | Web App Manifest                   | ✅     | `app/manifest.ts` (natif Next.js)         |
| 2   | Icônes PWA (192×192, 512×512)      | ✅     | Générées depuis `public/logo/logo_gr.png` |
| 3   | `theme_color` + `background_color` | ✅     | Dans le manifest + meta                   |
| 4   | Meta tags Apple (iOS / Safari)     | ✅     | Dans `app/layout.tsx`                     |
| 5   | Service Worker                     | ✅     | `next-pwa` (build avec `--webpack`)       |
| 6   | HTTPS                              | ⬜     | Obligatoire en prod pour PWA              |
| 7   | UI responsive                      | ⬜     | Déjà ciblé via viewport / Tailwind        |

---

## 1. Web App Manifest

- **Implémentation :** fichier statique **`public/manifest.json`** (JSON). Servi à l’URL `/manifest.json` avec `Content-Type: application/manifest+json` (headers dans `next.config.ts`).
- Lien dans `layout.tsx` : `metadata.manifest: "/manifest.json"`.
- Contenu à prévoir :
  - `name`, `short_name`, `description`
  - `start_url: '/'`
  - `display: 'standalone'` (ou `'minimal-ui'`)
  - `background_color`, `theme_color` : **`#0a0a0a`** (réutiliser `--bg` de `app/globals.css`)
  - `icons`: au moins **192×192** et **512×512** (PNG), chemins vers `public/`.

Référence : [Next.js – Metadata Files (manifest)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).

---

## 2. Icônes PWA (192 + 512)

- **Source :** `public/logo/logo_gr.png` (logo GR fond noir, G blanc, R cyan).
- **À faire :**
  - Générer deux PNG à partir de ce logo :
    - `public/logo/icon-192.png` (192×192)
    - `public/logo/icon-512.png` (512×512)
  - Les référencer dans `app/manifest.ts` sous `/logo/icon-192.png` et `/logo/icon-512.png`.
- **Outils possibles :** script Node (sharp), outil en ligne (ex. [realfavicongenerator.net](https://realfavicongenerator.net)), ou export manuel depuis un éditeur d’images.

---

## 3. `theme_color` (et `background_color`)

- **Source de vérité :** `app/globals.css` — variable `--bg: #0a0a0a`.
- **Dans le manifest :**
  - `theme_color` : **`#0a0a0a`** (barre de statut / UI navigateur = même que le fond de l’app).
  - `background_color` : **`#0a0a0a`** (fond au lancement).
- Ne pas utiliser le cyan du logo pour le thème PWA — uniquement le bg existant.
- À dupliquer en meta pour Safari/Apple (voir section 4).

---

## 4. Meta tags Apple (iOS / Safari)

À ajouter dans le `<head>` (via `metadata` ou balises dans `app/layout.tsx`) :

- `apple-mobile-web-app-capable` (content `yes`)
- `apple-mobile-web-app-status-bar-style` (ex. `black-translucent` ou `default`)
- `apple-mobile-web-app-title` (nom court de l’app)
- Référence vers une **apple-touch-icon** (recommandé 180×180 pour iOS), ex. `/logo/apple-touch-icon.png`

Cela améliore l’expérience “Ajouter à l’écran d’accueil” sur iPhone/iPad.

---

## 5. Service Worker

- **Rôle :** cache, offline, éventuellement push (plus tard).
- **Options :**
  - **next-pwa** (`pnpm add next-pwa`) : génère un SW avec Workbox. À brancher dans `next.config.ts` (wrapper `withPWA`). Vérifier la compatibilité avec Next 16 et Turbopack.
  - **Alternative :** SW personnalisé (fichier `public/sw.js`) + enregistrement dans un composant client, ou utilisation de **@serwist/next** (fork maintenu de next-pwa).
- **À prévoir :**
  - Stratégie de cache (pages, static assets, API si besoin).
  - Pas de cache agressif sur les routes dynamiques / auth si inapproprié.

---

## 6. HTTPS

- PWA requièrent **HTTPS** en production (et en local, `localhost` est considéré comme sécurisé).
- Vérifier que le déploiement (Vercel, etc.) sert bien en HTTPS.

---

## 7. UI responsive

- Déjà pris en charge via :
  - `viewport` dans `app/layout.tsx` (`width: device-width`, `viewportFit: cover`).
  - Tailwind et design mobile-first.
- À garder en tête : zones de touch suffisantes, pas de hover-only pour les actions critiques.

---

## Ordre d’implémentation suggéré

1. Créer les icônes 192, 512 (et optionnel 180 pour Apple) à partir de `logo_gr.png`.
2. Ajouter **`app/manifest.ts`** avec `name`, `short_name`, `icons`, `theme_color`, `background_color`, `start_url`, `display`.
3. Ajouter les **meta Apple** dans le layout.
4. **Service Worker** : next-pwa configuré ; le build utilise `--webpack` (Next.js 16 utilise Turbopack par défaut, next-pwa repose sur webpack).
5. Valider en **HTTPS** (staging/prod) et vérifier “Installable” dans les DevTools (Application > Manifest, Service Worker).

---

## Fichiers à créer / modifier (résumé)

| Fichier                               | Action                                                |
| ------------------------------------- | ----------------------------------------------------- |
| `app/manifest.ts`                     | Créer — manifest PWA (icônes, theme_color, etc.)      |
| `public/logo/icon-192.png`            | Créer — à générer depuis `logo_gr.png`                |
| `public/logo/icon-512.png`            | Créer — à générer depuis `logo_gr.png`                |
| `public/logo/apple-touch-icon.png`    | Optionnel — 180×180 pour iOS                          |
| `app/layout.tsx`                      | Modifier — meta Apple + éventuellement viewport/theme |
| `next.config.ts`                      | Modifier — si utilisation de next-pwa (withPWA)       |
| `public/sw.js` ou généré par next-pwa | Selon choix SW                                        |

---

## Références

- [Next.js – Progressive Web Apps](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Next.js – Metadata (manifest)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [web.dev – PWA Checklist](https://web.dev/pwa-checklist/)
