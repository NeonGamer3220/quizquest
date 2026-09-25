import React, { useState } from "react";
import { library } from "../../libraryStore.js";
import SetCard from "./SetCard.jsx";

export default function DiscoverPage({ onBack, onHost }) {
  const [q, setQ] = useState("");
  const sets = library.publicSets().filter((s) => s.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="screen">
      <h2>🧭 Discover Public Sets</h2>
      <input className="formInput" style={{ maxWidth: 320 }} placeholder="Search public sets..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="setGrid">
        {sets.map((s) => <SetCard key={s.id} set={s} onHost={onHost} />)}
        {sets.length === 0 && <p style={{ color: "var(--sub)" }}>No sets match your search.</p>}
      </div>
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
