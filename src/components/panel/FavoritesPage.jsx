import React, { useState } from "react";
import { library } from "../../libraryStore.js";
import SetCard from "./SetCard.jsx";

export default function FavoritesPage({ onBack, onHost }) {
  const [, force] = useState(0);
  const sets = library.favoriteSets();
  return (
    <div className="screen">
      <h2>⭐ Favorites</h2>
      <div className="setGrid">
        {sets.map((s) => (
          <div key={s.id} onClick={() => force((n) => n + 1)}>
            <SetCard set={s} onHost={onHost} />
          </div>
        ))}
        {sets.length === 0 && <p style={{ color: "var(--sub)" }}>Star a set from Discover or your Library to see it here.</p>}
      </div>
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
