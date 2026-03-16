# Audit pré-déploiement — Shadow (Next.js / React / PWA)

**Date :** mars 2025  
**Périmètre :** qualité du code, architecture, TypeScript, performance, PWA, sécurité.

---

## 1. Synthèse

| Critère            | État | Commentaire                                                                                         |
| ------------------ | ---- | --------------------------------------------------------------------------------------------------- |
| Architecture       | ✅   | Features bien découpées, barils sans logique, lib/ transverse.                                      |
| TypeScript strict  | ✅   | `strict: true`, pas de `any` en prod, `unknown` limité et justifié.                                 |
| Validation données | ✅   | Zod sur toutes les Server Actions (auth, calendar, messages).                                       |
| Animations         | ✅   | Framer Motion + `useReducedMotion` (PageTransition), `motion-reduce` (LoadingSpinner).              |
| PWA                | ✅   | Manifest, SW (next-pwa), enregistrement client, meta Apple. Middleware exclut désormais sw/workbox. |
| Sécurité           | ⚠️   | CSP avec `unsafe-inline` / `unsafe-eval` ; env non validée par schéma Zod.                          |
| Performance        | ⚠️   | Pas de `next/dynamic` pour modales lourdes ; pas d’error/loading boundaries.                        |
| Erreurs / UX       | ⚠️   | Pas de `error.tsx` ni `loading.tsx` dans l’App Router.                                              |

---

## 2. Points forts

- **App Router** : layout racine clair, `next/font` (Oswald, Space_Mono), metadata PWA (manifest, theme-color, apple-mobile-web-app-\*).
- **Auth** : middleware avec `getClaims()` (recommandé @supabase/ssr), redirection vers `/login` sur routes protégées, routes publiques explicites.
- **Features** : auth, calendar, home, messages bien isolées ; index = réexport uniquement.
- **Supabase** : client/server/middleware avec vérification des env au runtime ; pas de fetch direct dans les composants UI.
- **PWA** : `manifest.json`, SW généré en prod, enregistrement après `load`, `skipWaiting` pour mises à jour. **Correction appliquée :** le matcher du middleware exclut désormais `sw.js`, `workbox-*.js` et `manifest.json` pour éviter des appels inutiles à `getClaims()` sur ces assets.

---

## 3. Recommandations avant / après déploiement

### 3.1 Priorité haute

1. **Error & loading boundaries**
   - Ajouter `app/error.tsx` (erreur globale de la section) et `app/global-error.tsx` (racine + body).
   - Ajouter `app/loading.tsx` (et éventuellement par route : `app/messages/loading.tsx`, etc.) pour les états de chargement.

2. **Sécurité CSP**
   - Réduire progressivement `script-src 'unsafe-inline' 'unsafe-eval'` (nonces ou hashes) si la stack le permet.
   - Garder les autres directives (connect-src Supabase, frame-ancestors 'none', etc.).

### 3.2 Priorité moyenne

3. **Variables d’environnement**
   - Créer un module `lib/config/env.ts` avec un schéma Zod qui valide `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` au démarrage et exporte un objet typé. Utiliser ce module dans `client.ts`, `server.ts`, `middleware.ts`.

4. **Performance**
   - Utiliser `next/dynamic` avec `ssr: false` pour les modales lourdes (ex. `MessageMediaViewerModal`, `EventDetailModal`, `AddEventModal`) pour alléger le bundle initial.

5. **Middleware — erreur getClaims**
   - Envelopper `getClaims()` dans un try/catch : en cas d’erreur (ex. Supabase indisponible), renvoyer une réponse 503 ou une page d’erreur au lieu de laisser l’exception remonter.

### 3.3 Priorité basse

6. **PWA**
   - Tester installabilité et mode offline après `pnpm build` + `pnpm start` (ou déploiement HTTPS).
   - Vérifier la compatibilité de `next-pwa` avec Next 16 à chaque upgrade majeure (Turbopack non supporté → build avec `--webpack`).

7. **Manifest**
   - Ajouter un champ `id` dans `public/manifest.json` si besoin pour certains navigateurs (optionnel).

---

## 4. TypeScript & interdictions

- **`any`** : aucun en code de production.
- **`unknown`** : utilisé de façon justifiée (params Server Actions avant parse Zod, payloads Supabase realtime, `logError`, typage SWR `mutate`). Les `as unknown as` restent limités aux tests (mocks).
- **Index** : aucun code métier dans les `index.ts` des features ; réexport uniquement.

---

## 5. Fichiers modifiés lors de l’audit

- **middleware.ts** : matcher étendu pour exclure `sw.js`, `workbox-*.js`, `manifest.json` et éviter l’exécution du middleware sur les assets PWA.

---

## 6. Checklist déploiement

- [ ] `pnpm build` (avec `--webpack`) OK.
- [ ] `pnpm start` puis test manuel des parcours critiques (login, messages, calendrier).
- [ ] Vérifier que les variables d’environnement Supabase sont définies en production.
- [ ] Tester l’installation PWA (Add to Home Screen) et le chargement hors ligne si utilisé.
- [ ] Vérifier les en-têtes de sécurité (CSP, X-Frame-Options, etc.) en production.
- [ ] Activer error/loading boundaries avant ou juste après le premier déploiement.
