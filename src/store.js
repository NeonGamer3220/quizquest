// Real Supabase-backed auth, with a local-only fallback so the app still
// runs before you've filled in .env (see .env.example / README).
import { supabase, supabaseReady } from "./lib/supabaseClient.js";

const LOCAL_KEY = "quizquest_local_v1";
function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { users: {}, sets: ["World Capitals", "Math Basics", "Science Quiz"], gamesPlayed: 0 };
}
let local = loadLocal();
function persistLocal() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
}

export const store = {
  ready: supabaseReady,
  get: () => local,
  incGames() {
    local.gamesPlayed++;
    persistLocal();
  },

  async register(username, email, password) {
    if (!supabaseReady) {
      local.users[username] = { password };
      persistLocal();
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    return { error };
  },

  async login(email, password) {
    if (!supabaseReady) {
      const username = email.split("@")[0] || "Teacher";
      if (!local.users[username]) local.users[username] = { password };
      persistLocal();
      return { user: username, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error };
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", data.user.id)
      .single();
    return { user: profile?.username || email.split("@")[0], error: null };
  },

  async logout() {
    if (supabaseReady) await supabase.auth.signOut();
  },
};
