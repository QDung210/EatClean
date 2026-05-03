# EatClean Tracker

Personal nutrition + workout tracking app. React + Vite frontend deployed to GitHub Pages, Supabase for auth and data.

## Stack

- **Frontend**: React 18, Vite, Recharts
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **Deploy**: GitHub Pages via `gh-pages`

---

## Setup

### 1. Create Supabase project

1. Go to [supabase.com](https://supabase.com) → New project
2. Note your **Project URL** and **anon/public API key** (Settings → API)

### 2. Run the database schema

In Supabase dashboard → SQL Editor, paste and run the contents of `supabase/schema.sql`.

This creates tables: `profiles`, `meal_tracking`, `weight_logs`, `day_overrides` — all with RLS enabled.

### 3. Enable Google OAuth

**In Google Cloud Console:**
1. Create a project at [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application)
3. Authorized redirect URIs — add both:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
4. Copy **Client ID** and **Client Secret**

**In Supabase dashboard:**
1. Authentication → Providers → Google → Enable
2. Paste Client ID and Client Secret
3. Authentication → URL Configuration → add to **Redirect URLs**:
   - `http://localhost:5173/eatclean/` (local dev)
   - `https://<your-github-username>.github.io/eatclean/` (production)

### 4. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

`.env.local` is gitignored — never commit it.

---

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/eatclean/](http://localhost:5173/eatclean/)

---

## Deploy to GitHub Pages

Make sure the repo is pushed to GitHub as `eatclean` (or update `base` in `vite.config.js` to match your repo name).

```bash
npm run deploy
```

This builds and pushes to the `gh-pages` branch. GitHub Pages will serve from `https://<username>.github.io/eatclean/`.

First deploy: enable GitHub Pages in repo Settings → Pages → Source: `gh-pages` branch.

---

## Database Schema Overview

| Table | Key columns |
|-------|-------------|
| `profiles` | `id` (= auth user), `height`, `weight`, `age`, `goal` |
| `meal_tracking` | `user_id`, `date`, `plan_key`, `meal_0_done`…`meal_6_done`, supplement booleans, `water_cups` |
| `weight_logs` | `user_id`, `date`, `weight` |
| `day_overrides` | `user_id`, `date`, `plan_key` |

All tables use RLS — users can only read/write their own rows.

A database trigger auto-creates a default profile row on first sign-in.
