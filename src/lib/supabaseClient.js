import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseReady = Boolean(url && key);

// If env vars aren't set yet, we export null and the app falls back to
// local-only demo mode so it still runs before you've configured Supabase.
export const supabase = supabaseReady ? createClient(url, key) : null;
