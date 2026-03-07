# Shade

Application web privée : messages éphémères (24h), calendrier partagé, notifications. Installable en PWA.

**Stack :** Next.js 16 (App Router), Supabase (Auth, DB, Realtime), TypeScript strict, React 19, Tailwind CSS.

---

## Commandes

| Commande                 | Description                   |
| ------------------------ | ----------------------------- |
| `pnpm dev`               | Serveur de développement      |
| `pnpm build`             | Build de production           |
| `pnpm start`             | Démarrer en production        |
| `pnpm lint`              | Linter ESLint                 |
| `pnpm run test:run`      | Tests unitaires (Vitest)      |
| `pnpm run test:coverage` | Tests + rapport de couverture |
| `pnpm run e2e`           | Tests E2E (Playwright)        |
| `pnpm exec tsc --noEmit` | Vérification TypeScript       |

---

## Variables d’environnement

Créer un fichier `.env.local` à la racine :

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

Sans ces variables, le middleware renvoie une erreur 503 (configuration manquante).

---

## Structure du projet

- **`app/`** — Routing et orchestration (pages, layouts, metadata).
- **`features/`** — Logique métier par domaine (auth, calendar, messages, home). Chaque feature expose un `index.ts` (actions, components, data, schemas, etc.).
- **`lib/`** — Code transverse (config, Supabase, rate limit, utils).
- **`components/`** — Composants UI réutilisables (layout, cartes, icônes).
- **`types/`** — Types globaux.

Voir **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** pour les règles détaillées et où ajouter du code.

---

## Documentation

- **[Documentation développeur](docs/DOCUMENTATION.md)** — Guide complet : installation, architecture, features, tests, sécurité, conventions (point d’entrée pour un nouveau dev).
- [Architecture](docs/ARCHITECTURE.md) — Arborescence, règles par dossier.
- [Conventions composants](docs/CONVENTIONS-COMPOSANTS.md) — Structure des composants (orchestrateur, sous-dossiers).
- [Audit sécurité](docs/PENTEST-SECURITY-AUDIT.md) — Rapport type pentest.
