import React, { useState } from "react";
import { library } from "../../libraryStore.js";
import SetCard from "./SetCard.jsx";

export default function LibraryPage({ onBack, onHost, toast }) {
  const [, force] = useState(0);
  const sets = library.mySets();
  function del(id) {
    library.deleteSet(id);
    toast("🗑 Set deleted");
    force((n) => n + 1);
  }
  return (
    <div className="screen">
      <h2>📚 My Library</h2>
      <p style={{ color: "var(--sub)" }}>Sets you've created ({sets.length}).</p>
      <div className="setGrid">
        {sets.map((s) => <SetCard key={s.id} set={s} onHost={onHost} onDelete={del} />)}
        {sets.length === 0 && <p style={{ color: "var(--sub)" }}>You haven't created any sets yet — head to Create!</p>}
      </div>
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
