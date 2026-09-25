import React, { useState } from "react";
import { library } from "../../libraryStore.js";

export default function HomeworkPage({ onBack, toast }) {
  const [, force] = useState(0);
  const [setId, setSetId] = useState("");
  const [due, setDue] = useState("");
  const sets = [...library.mySets(), ...library.publicSets()];
  const homework = library.get().homework;

  function assign() {
    if (!setId) return toast("Pick a set to assign");
    if (!due) return toast("Pick a due date");
    const set = sets.find((s) => s.id === setId);
    library.assignHomework({ setId, setTitle: set.title, due });
    toast(`📝 Assigned "${set.title}", due ${due}`);
    setSetId(""); setDue("");
    force((n) => n + 1);
  }
  function remove(id) {
    library.deleteHomework(id);
    force((n) => n + 1);
  }

  return (
    <div className="screen">
      <h2>📝 Homework</h2>
      <p style={{ color: "var(--sub)" }}>Assign a set for students to complete anytime before the due date.</p>
      <div className="card" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <select className="formInput" style={{ maxWidth: 260 }} value={setId} onChange={(e) => setSetId(e.target.value)}>
          <option value="">Choose a set...</option>
          {sets.map((s) => <option value={s.id} key={s.id}>{s.title}</option>)}
        </select>
        <input className="formInput" style={{ maxWidth: 180 }} type="date" value={due} onChange={(e) => setDue(e.target.value)} />
        <button className="btn primary" onClick={assign}>Assign</button>
      </div>

      <h3 style={{ marginTop: 20 }}>Assigned Homework</h3>
      {homework.length === 0 && <p style={{ color: "var(--sub)" }}>Nothing assigned yet.</p>}
      {homework.map((h) => (
        <div className="card" key={h.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{h.setTitle} — due {h.due}</span>
          <button className="btn" onClick={() => remove(h.id)}>🗑</button>
        </div>
      ))}
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
