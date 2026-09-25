# QuizQuest 🟣

A Blooket-style live quiz game platform — black/purple theme, Low Detail Mode for tablets, and a fully playable **Gold Quest** gamemode (Fishing Frenzy & Crypto Hack are stubbed and ready to build out).

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
1. Push this folder to a new GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/quizquest.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Vercel auto-detects Vite (framework preset = "Vite"); `vercel.json` is already included. Click **Deploy**.
4. Done — you get a live `*.vercel.app` URL.

## Project structure
```
src/
  components/        UI screens (join, login, teacher panel, database, play select...)
  components/games/  Gamemode engines (GoldQuest.jsx now; add FishingFrenzy.jsx, CryptoHack.jsx here)
  data/questions.js  Sample question bank — replace with your real sets
  store.js           Mock localStorage "database" — swap for Supabase/Firebase/Postgres for real accounts + multiplayer
```

## Current state / what's real vs. mocked
- **Real & working:** all menus, theme + LDM toggle, register/login (stored in browser localStorage), teacher panel nav, Gold Quest gameplay (questions, chests, gold/double/triple/take/dragon/swap, bots, leaderboard, win condition).
- **Mocked (single browser only):** the "database" is `localStorage`, not a server — nothing syncs between devices yet.
- **Not built yet:** real multiplayer (needs a backend/websocket layer — e.g. a small Node/WebSocket server or a service like Supabase Realtime, deployed alongside on Vercel or Railway), Fishing Frenzy engine, Crypto Hack engine, quiz set editor.

## Next steps to make it a real multiplayer platform
Vercel serverless functions are stateless and short-lived, so live multiplayer game rooms need either:
- A small persistent WebSocket server (Railway/Fly.io/Render) that the Vercel frontend connects to, or
- A realtime backend service (Supabase Realtime, Firebase Realtime DB, PartyKit, Pusher) for host↔player sync.

Happy to wire one of these in next — just say the word.
