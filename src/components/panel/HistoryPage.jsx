import React from "react";
import { library } from "../../libraryStore.js";

const MODE_LABEL = { gold: "🐉 Gold Quest", fish: "🎣 Fishing Frenzy", crypto: "💻 Crypto Hack" };

export default function HistoryPage({ onBack }) {
  const history = library.get().history;
  return (
    <div className="screen">
      <h2>🕓 Play History</h2>
      {history.length === 0 && <p style={{ color: "var(--sub)" }}>No games played yet this session — host a game to see it logged here.</p>}
      {history.map((h) => (
        <div className="card" key={h.id} style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{MODE_LABEL[h.mode] || h.mode} {h.setTitle ? `— ${h.setTitle}` : ""}</span>
          <span style={{ color: "var(--sub)" }}>{new Date(h.playedAt).toLocaleString()}</span>
        </div>
      ))}
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
