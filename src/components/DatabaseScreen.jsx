import React from "react";
import { store } from "../store.js";

export default function DatabaseScreen({ onBack }) {
  const db = store.get();
  return (
    <div className="screen">
      <h2>🗄️ Database</h2>
      <p style={{ color: "var(--sub)" }}>
        Local mock database (persists in this browser via localStorage). Swap in
        Supabase/Firebase/Postgres for a real backend.
      </p>
      <div className="card"><b>Users:</b> {Object.keys(db.users).join(", ") || "(none yet)"}</div>
      <div className="card"><b>Quiz Sets:</b> {db.sets.join(", ")}</div>
      <div className="card"><b>Games Played:</b> {db.gamesPlayed}</div>
      <button className="btn" onClick={onBack}>← Back</button>
    </div>
  );
}
