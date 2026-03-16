# Analyse performance — Shadow

**Date :** mars 2025  
**Périmètre :** bundle, données, images, listes, realtime.

---

## 1. Synthèse

| Domaine        | État | Action prioritaire                       |
| -------------- | ---- | ---------------------------------------- |
| Fonts & images | ✅   | —                                        |
| Cache / SWR    | ✅   | —                                        |
| Code splitting | ⚠️   | Dynamic import modales lourdes           |
| Listes         | ✅   | Virtualisation si > ~100 items plus tard |
| Realtime       | ✅   | —                                        |
| Animations     | ✅   | —                                        |

---

## 2. Ce qui est déjà bien

### Fonts

- **next/font** (Oswald, Space_Mono) dans `app/layout.tsx`, `display: "optional"` → pas de blocage rendu, variable CSS.

### Images

- **next/image** utilisé pour : HomeView (hero avec `priority`, `sizes`), MessageMediaViewerModal, AttachMediaModal.
- `remotePatterns` Supabase dans `next.config.ts` pour les URLs storage.

### Données & cache

- **SWR** avec `fallbackData: initial` sur le thread messages → pas de flash, revalidation en arrière-plan.
- **revalidatePath** systématique après mutations (messages, events, conversations).
- Données initiales chargées côté serveur (getConversationsForList, getThreadData, getEventsForCalendar) puis cache client.

### Realtime

- Abonnements Supabase (messages, badge, calendar events) avec cleanup dans les `useEffect` (unsubscribe, removeChannel).

### Animations

- **useReducedMotion** (PageTransition, EventDetailModal), **motion-reduce** sur LoadingSpinner → respect préférence utilisateur.

### Loading / erreur

- `app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, loading par section (messages, main).

---

## 3. Améliorations mises en place

### Code splitting des modales lourdes

- **MessageMediaViewerModal** : chargé dynamiquement depuis MessageBubbleView (`next/dynamic`, `ssr: false`). Réduit le bundle initial de la page messages.
- **DayEventsModal**, **EventDetailModal** et **AddEventModal** : chargés dynamiquement depuis CalendarViewModals. Réduit le bundle initial de la page calendrier.

Impact : premier chargement plus léger ; modales chargées au premier affichage (léger délai possible la première fois).

---

## 4. Pistes ultérieures (si besoin)

- **Listes longues** : si le nombre de conversations ou de messages d’un thread dépasse ~100–200, envisager une virtualisation (ex. `@tanstack/react-virtual`) pour limiter le nombre de DOM nodes.
- **Bundle analyzer** : `pnpm build:analyze` génère les rapports dans `.next/analyze/` (`client.html` pour le bundle navigateur). Ouvrir dans un navigateur pour voir le treemap et les chunks dynamiques.
- **Prefetch** : les `Link` Next font du prefetch par défaut ; possible de désactiver sur certains liens secondaires pour réduire le trafic si nécessaire.
