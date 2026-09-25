// Local library store (sets, favorites, history, homework) — localStorage-backed.
// Swap for the `quiz_sets` / `quiz_questions` Supabase tables (see supabase/schema.sql)
// when you're ready to persist this server-side too.
const KEY = "quizquest_library_v1";

function seed() {
  return {
    sets: [
      { id: "s1", title: "World Capitals", isPublic: true, author: "QuizQuest Team",
        questions: [
          { q: "Capital of Japan?", a: ["Osaka", "Tokyo", "Kyoto", "Nagoya"], c: 1 },
          { q: "Capital of Egypt?", a: ["Cairo", "Giza", "Luxor", "Aswan"], c: 0 },
        ] },
      { id: "s2", title: "Math Basics", isPublic: true, author: "QuizQuest Team",
        questions: [
          { q: "7 x 6 = ?", a: ["36", "42", "48", "40"], c: 1 },
          { q: "Square root of 81?", a: ["8", "9", "7", "10"], c: 1 },
        ] },
      { id: "s3", title: "Science Quiz", isPublic: true, author: "QuizQuest Team",
        questions: [
          { q: "Chemical symbol for gold?", a: ["Ag", "Au", "Gd", "Go"], c: 1 },
        ] },
    ],
    favorites: [],
    history: [],
    homework: [],
  };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return seed();
}
let data = load();
function persist() { localStorage.setItem(KEY, JSON.stringify(data)); }

export const library = {
  get: () => data,

  addSet(set) {
    const s = { id: "s" + Date.now(), isPublic: false, author: "You", ...set };
    data.sets.unshift(s);
    persist();
    return s;
  },
  updateSet(id, patch) {
    data.sets = data.sets.map((s) => (s.id === id ? { ...s, ...patch } : s));
    persist();
  },
  deleteSet(id) {
    data.sets = data.sets.filter((s) => s.id !== id);
    data.favorites = data.favorites.filter((f) => f !== id);
    persist();
  },
  mySets: () => data.sets.filter((s) => s.author === "You"),
  publicSets: () => data.sets.filter((s) => s.isPublic),

  toggleFavorite(id) {
    data.favorites = data.favorites.includes(id)
      ? data.favorites.filter((f) => f !== id)
      : [...data.favorites, id];
    persist();
  },
  isFavorite: (id) => data.favorites.includes(id),
  favoriteSets: () => data.sets.filter((s) => data.favorites.includes(s.id)),

  logHistory(entry) {
    data.history.unshift({ id: "h" + Date.now(), playedAt: new Date().toISOString(), ...entry });
    data.history = data.history.slice(0, 50);
    persist();
  },

  assignHomework(hw) {
    const h = { id: "hw" + Date.now(), createdAt: new Date().toISOString(), ...hw };
    data.homework.unshift(h);
    persist();
    return h;
  },
  deleteHomework(id) {
    data.homework = data.homework.filter((h) => h.id !== id);
    persist();
  },
};
