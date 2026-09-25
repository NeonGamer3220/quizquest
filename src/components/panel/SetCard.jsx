import React from "react";
import { library } from "../../libraryStore.js";

export default function SetCard({ set, onHost, onDelete, showFav = true }) {
  const fav = library.isFavorite(set.id);
  return (
    <div className="card setCard">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <b>{set.title}</b>
          <p style={{ color: "var(--sub)", fontSize: ".85rem", margin: "4px 0" }}>
            {set.questions.length} question{set.questions.length === 1 ? "" : "s"} · by {set.author}
            {set.isPublic && " · Public"}
          </p>
        </div>
        {showFav && (
          <button className="favBtn" onClick={() => library.toggleFavorite(set.id)} title="Favorite">
            {fav ? "⭐" : "☆"}
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        {onHost && <button className="btn primary" onClick={() => onHost(set)}>🎟️ Host</button>}
        {onDelete && <button className="btn" onClick={() => onDelete(set.id)}>🗑 Delete</button>}
      </div>
    </div>
  );
}
