# Plan de mise en place PWA — Ghost Riders (Shade)

Ce document décrit les étapes pour transformer l’app en Progressive Web App (installable, offline-capable, app-like).

---

## Checklist globale

| #   | Tâche                              | Statut | Notes                                              |
| --- | ---------------------------------- | ------ | -------------------------------------------------- |
| 1   | Web App Manifest                   | ✅     | `public/manifest.json`                             |
| 2   | Icônes PWA (192×192, 512×512)      | ✅     | `public/favicon-for-public/` (web-app-manifest-\*) |
| 3   | `theme_color` + `background_color` | ✅     | Dans le manifest + meta                            |
| 4   | Meta tags Apple (iOS / Safari)     | ✅     | Dans `app/layout.tsx` (icons.apple)                |
| 5   | Service Worker                     | ✅     | `next-pwa` (build avec `--webpack`)                |
| 6   | HTTPS                              | ⬜     | Obligatoire en prod pour PWA                       |
| 7   | UI responsive                      | ⬜     | Déjà ciblé via viewport / Tailwind                 |

---

## 1. Web App Manifest

- **Implémentation :** fichier statique **`public/manifest.json`**. Servi à l’URL `/manifest.json` avec `Content-Type: application/manifest+json` (headers dans `next.config.ts`).
- Lien dans `layout.tsx` : `metadata.manifest: "/manifest.json"`.
- Contenu : `name`, `short_name`, `description`, `start_url`, `display`, `background_color`, `theme_color`, `icons` (chemins vers `public/`).

Référence : [Next.js – Metadata Files (manifest)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest).

---

## 2. Icônes et favicon

Les icônes sont fournies dans deux dossiers sous `public/` :

- **`public/favicon-for-app/`** — favicon et Apple touch icon :
  - `favicon.ico` : icône d’onglet (référencée dans `app/layout.tsx` via `metadata.icons.icon`)
  - `apple-icon.png` : icône « Ajouter à l’écran d’accueil » iOS (référencée via `metadata.icons.apple`)

- **`public/favicon-for-public/`** — icônes PWA (manifest) :
  - `web-app-manifest-192x192.png` (192×192)
  - `web-app-manifest-512x512.png` (512×512)

Référencées dans `public/manifest.json` sous `/favicon-for-public/web-app-manifest-192x192.png` et `/favicon-for-public/web-app-manifest-512x512.png`.

---

## 3. `theme_color` (et `background_color`)

- **Source de vérité :** `app/globals.css` — variable `--bg: #0a0a0a`.
- **Dans le manifest :** `theme_color` et `background_color` : **`#0a0a0a`**.
- À dupliquer en meta pour Safari/Apple (voir section 4).

---

## 4. Meta tags Apple (iOS / Safari)

Dans `app/layout.tsx` (via `metadata`) :

- `icons.apple` : `/favicon-for-app/apple-icon.png`
- `other['apple-mobile-web-app-capable']` : `yes`
- `other['apple-mobile-web-app-status-bar-style']` : `black-translucent`
- `other['apple-mobile-web-app-title']` : nom court de l’app

---

## 5. Service Worker

- **next-pwa** : génère un SW avec Workbox. Build avec `--webpack` (next-pwa repose sur webpack).
- Middleware : exclusion des requêtes vers `sw.js`, `workbox-*.js`, `manifest.json` pour éviter les traitements inutiles.

---

## 6. HTTPS

- PWA requièrent **HTTPS** en production. Vérifier que le déploiement (Vercel, etc.) sert bien en HTTPS.

---

## 7. UI responsive

- Viewport dans `app/layout.tsx`, Tailwind mobile-first. Zones de touch suffisantes.

---

## Fichiers concernés (résumé)

| Fichier                                            | Rôle                                 |
| -------------------------------------------------- | ------------------------------------ |
| `public/manifest.json`                             | Manifest PWA (icônes, theme…)        |
| `public/favicon-for-app/favicon.ico`               | Favicon onglet                       |
| `public/favicon-for-app/apple-icon.png`            | Apple touch icon                     |
| `public/favicon-for-public/web-app-manifest-*.png` | Icônes 192 / 512 PWA                 |
| `app/layout.tsx`                                   | metadata.icons, manifest, meta Apple |
| `next.config.ts`                                   | Headers manifest, next-pwa           |

---

## Références

- [Next.js – Progressive Web Apps](https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps)
- [Next.js – Metadata (manifest)](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)
- [web.dev – PWA Checklist](https://web.dev/pwa-checklist/)
