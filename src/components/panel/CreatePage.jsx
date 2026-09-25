import React, { useState } from "react";
import { library } from "../../libraryStore.js";

function blankQ() { return { q: "", a: ["", "", "", ""], c: 0 }; }

export default function CreatePage({ onBack, toast }) {
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [questions, setQuestions] = useState([blankQ()]);

  function updateQ(i, patch) {
    setQuestions((qs) => qs.map((q, qi) => (qi === i ? { ...q, ...patch } : q)));
  }
  function updateChoice(i, ci, val) {
    setQuestions((qs) => qs.map((q, qi) => (qi === i ? { ...q, a: q.a.map((c, cci) => (cci === ci ? val : c)) } : q)));
  }
  function addQuestion() { setQuestions((qs) => [...qs, blankQ()]); }
  function removeQuestion(i) { setQuestions((qs) => qs.filter((_, qi) => qi !== i)); }

  function save() {
    if (!title.trim()) return toast("Give your set a title");
    const clean = questions.filter((q) => q.q.trim() && q.a.every((a) => a.trim()));
    if (clean.length === 0) return toast("Add at least one complete question");
    library.addSet({ title: title.trim(), isPublic, questions: clean });
    toast(`✅ Saved "${title}" with ${clean.length} question(s)!`);
    setTitle(""); setQuestions([blankQ()]); setIsPublic(false);
  }

  return (
    <div className="screen">
      <h2>➕ Create a Set</h2>
      <div className="card">
        <input className="formInput" placeholder="Set title (e.g. Chapter 4 Vocabulary)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label className="ldmToggle" style={{ marginTop: 8 }}>
          <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
          Make this set public (visible in Discover)
        </label>
      </div>

      {questions.map((q, i) => (
        <div className="card" key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <b>Question {i + 1}</b>
            {questions.length > 1 && <button className="btn" onClick={() => removeQuestion(i)}>🗑 Remove</button>}
          </div>
          <input className="formInput" placeholder="Question text" value={q.q} onChange={(e) => updateQ(i, { q: e.target.value })} />
          <div className="answers" style={{ marginTop: 10 }}>
            {q.a.map((choice, ci) => (
              <div key={ci} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="radio" name={`correct-${i}`} checked={q.c === ci} onChange={() => updateQ(i, { c: ci })} title="Mark as correct answer" />
                <input className="formInput" placeholder={`Choice ${ci + 1}`} value={choice} onChange={(e) => updateChoice(i, ci, e.target.value)} />
              </div>
            ))}
          </div>
          <p style={{ color: "var(--sub)", fontSize: ".8rem", marginTop: 6 }}>Select the radio button next to the correct answer.</p>
        </div>
      ))}

      <button className="btn" onClick={addQuestion}>➕ Add another question</button>
      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <button className="btn primary" onClick={save}>💾 Save Set</button>
        <button className="btn" onClick={onBack}>← Back to Panel</button>
      </div>
    </div>
  );
}
