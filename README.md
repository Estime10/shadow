# Ephemeral Friends App — PWA

Web App privée avec messages éphémères (24h), partage de médias, calendrier partagé et notifications realtime.
Installable comme une app native sur iPhone et Android via PWA.

---

# Stack Technique

## Frontend

- Next.js
- TailwindCSS
- Supabase Client
- PWA (Service Worker)

## Backend (Supabase)

- Database (PostgreSQL)
- Realtime subscriptions
- Storage (images / vidéos)
- Auth (optionnel)

## Hosting

- Vercel

---

# Features

## Messages éphémères

- Texte
- Images
- Vidéos
- Expiration automatique après 24h
- Realtime

## Calendar partagé

- Events internes à l'app
- Notifications visuelles
- Pas de sync avec calendar téléphone

## Notifications

- Badge dans l'app
- Realtime
- Push notifications (optionnel)

## PWA

- Installable
- Fullscreen
- Icône home screen
- Native-like

---

# Installation

## 1. Create Next.js app

```bash
npx create-next-app ephemeral-app
cd ephemeral-app
```

Install deps:

```bash
npm install @supabase/supabase-js
npm install next-pwa
```

---

## 2. Setup Supabase

Créer projet Supabase

Créer tables SQL :

```sql
-- USERS
create table users (
  id uuid primary key default gen_random_uuid(),
  username text unique,
  created_at timestamp default now()
);

-- MESSAGES
create table messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  text text,
  media_url text,
  media_type text,
  created_at timestamp default now(),
  expires_at timestamp
);

-- EVENTS
create table events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  event_date timestamp,
  created_by uuid references users(id),
  created_at timestamp default now()
);
```

---

## 3. Storage setup

Créer bucket:

```
messages-media
```

Public bucket: true

---

## 4. Supabase client

Create:

```
/lib/supabase.js
```

```js
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
```

---

## 5. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

# Messages Logic

## Send message

```js
const sendMessage = async ({ text, file }) => {
  let media_url = null;

  if (file) {
    const path = `${Date.now()}-${file.name}`;

    await supabase.storage.from("messages-media").upload(path, file);

    media_url = path;
  }

  await supabase.from("messages").insert({
    text,
    media_url,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
};
```

---

## Fetch messages

```js
const { data } = await supabase
  .from("messages")
  .select("*")
  .gt("expires_at", new Date().toISOString())
  .order("created_at", { ascending: false });
```

---

## Realtime subscription

```js
useEffect(() => {
  const channel = supabase
    .channel("messages")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        console.log(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

---

# Calendar Logic

## Create event

```js
await supabase.from("events").insert({
  title,
  description,
  event_date,
});
```

## Fetch events

```js
await supabase.from("events").select("*").order("event_date");
```

---

# Auto delete expired messages

Option 1: Cron (recommended)

Supabase SQL:

```sql
delete from messages
where expires_at < now();
```

Run every hour.

---

# PWA Setup

Install:

```bash
npm install next-pwa
```

next.config.js

```js
const withPWA = require("next-pwa")({
  dest: "public",
});

module.exports = withPWA({});
```

---

Create manifest:

```
/public/manifest.json
```

```json
{
  "name": "Friends App",
  "short_name": "Friends",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000",
  "theme_color": "#000",
  "icons": [
    {
      "src": "/icon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

# Deploy

Push GitHub

Deploy Vercel

Done.

---

# Project Structure

```
/app
/messages
/calendar

/components
MessageList
MessageInput
Calendar

/lib
supabase.js

/public
manifest.json
```

---

# Future Improvements

Push notifications
User auth
Message reactions
Seen status
Typing indicator
Private groups

---

# Result

Installable app
Realtime
Ephemeral messages
Shared calendar
Private usage
No App Store needed

---

# Estimated Build Time

MVP: 4–6 hours
Full app polished: 1–2 days

---

# End
