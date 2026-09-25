import React from "react";
import { store } from "../store.js";

const TITLES = {
  create: "➕ Create a Set",
  discover: "🧭 Discover Public Sets",
  library: "📚 My Library",
  favorites: "⭐ Favorites",
  history: "🕓 Play History",
  homework: "📝 Homework",
  settings: "⚙️ Settings",
};

export default function GenericPage({ name, onBack }) {
  const db = store.get();
  let body = "Nothing here yet.";
  if (name === "create") body = "Build a question set: add title, questions, 4 answer choices. (Editor UI to expand next.)";
  if (name === "discover") body = "Browse public sets: " + db.sets.join(", ");
  if (name === "library") body = "Your saved sets: " + db.sets.join(", ");
  if (name === "favorites") body = "You have no favorites yet — star a set to add it here.";
  if (name === "history") body = "Games played this session: " + db.gamesPlayed;
  if (name === "homework") body = "Assign a set as async homework for students to complete anytime.";
  if (name === "settings") body = "Theme: Black-Purple · Toggle LDM on the join screen · More options soon.";

  return (
    <div className="screen">
      <h2>{TITLES[name] || name}</h2>
      <div className="card">{body}</div>
      <button className="btn" onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
