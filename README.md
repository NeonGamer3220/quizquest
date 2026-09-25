# QuizQuest 🟣

A Blooket-style live quiz game platform — black/purple theme, Low Detail Mode for tablets, real Supabase accounts, real-time room lobbies, and three full gamemodes: **Gold Quest**, **Fishing Frenzy**, and **Crypto Hack**.

## 1. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, go to **SQL Editor → New query**, paste the contents of `supabase/schema.sql`, and run it. This creates profiles, quiz sets, game rooms, and history tables with row-level security.
3. Go to **Project Settings → API**, copy your **Project URL** and **anon public key**.
4. Copy `.env.example` to `.env` and fill in both values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
5. In **Authentication → Providers**, make sure Email is enabled (it is by default). For testing, you can disable "Confirm email" under Authentication → Settings so accounts work instantly.

Without a `.env` file, the app still runs in **local demo mode** (auth + rooms are browser-only, no real sync) so you can preview it before setting Supabase up.

## 2. Run locally
```bash
npm install
npm run dev
```

## 3. Deploy to Vercel
```bash
git init && git add . && git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/quizquest.git
git push -u origin main
```
Import the repo at [vercel.com/new](https://vercel.com/new) (Vite auto-detected, `vercel.json` included). **Add your two `VITE_SUPABASE_*` env vars in the Vercel project settings** before deploying, then click Deploy.

## What's real now
- **Accounts:** real Supabase email/password auth, with a `profiles` table auto-created per user.
- **Rooms:** a host creates a room and gets a live code; players on other devices/tabs join with that code and appear in the lobby in real time (Supabase Realtime Presence). The host picks a gamemode and broadcasts "start" to everyone in the room instantly.
- **Gamemodes (all three, fully built):**
  - 🐉 **Gold Quest** — chests, +gold, double/triple, take 5/10/15/25%, dragon steal, rare swap.
  - 🎣 **Fishing Frenzy** — random fish/weight, 5 lure levels, 3 upgrades (lure/line/boat) bought with coins, periodic frenzy events (2x speed + 50% luck), target-weight win condition.
  - 💻 **Crypto Hack** — pick 1 of 5 passwords at the start; taking/swapping crypto from another player requires guessing their real password among 3 options in a timed hack window.
  - 🎲 **Random** — spins one of the three.

## What's still local-only (by design, for now)
Once a room's game **starts**, each player currently plays their own instance against AI bots rather than a fully server-synced shared board (same question, same timer, same leaderboard for every player live). That's the natural next step and needs either:
- A small persistent WebSocket/game-server layer (Railway/Fly.io) driving question state, or
- Supabase Realtime **broadcast** messages from the host driving every player's question index/timer directly (extending `useRoom.js`).

The lobby/presence wiring in `src/hooks/useRoom.js` is already the foundation for this — say the word and I'll extend it to fully synced shared gameplay next.

## Project structure
```
supabase/schema.sql       Run this in your Supabase SQL editor
src/lib/supabaseClient.js Supabase client (reads .env)
src/store.js              Auth (register/login/logout), falls back to local demo mode
src/hooks/useRoom.js      Realtime room lobby (presence + broadcast)
src/components/           Screens: join, login, teacher panel, lobby, database, play
src/components/games/     GoldQuest.jsx, FishingFrenzy.jsx, CryptoHack.jsx
src/data/questions.js     Sample question bank — replace with real quiz sets
```
