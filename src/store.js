// Tiny localStorage-backed "database" — swap this out for a real backend
// (Supabase/Firebase/Postgres via Vercel) later; the shape is kept simple on purpose.
const KEY = "quizquest_db_v1";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { users: {}, sets: ["World Capitals", "Math Basics", "Science Quiz"], gamesPlayed: 0 };
}

let db = load();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const store = {
  get: () => db,
  register(username, password) {
    db.users[username] = { password };
    persist();
  },
  login(username, password) {
    if (!db.users[username]) db.users[username] = { password }; // demo auto-register
    persist();
    return username;
  },
  incGames() {
    db.gamesPlayed++;
    persist();
  },
};
