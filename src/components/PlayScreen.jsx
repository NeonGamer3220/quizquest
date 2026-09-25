import React from "react";

const MODES = [
  { key: "gold", cls: "gold", ic: "🐉", name: "Gold Quest", by: "TT_Buur" },
  { key: "fish", cls: "fish", ic: "🎣", name: "Fishing Frenzy", by: "SABADAmars" },
  { key: "crypto", cls: "crypto", ic: "💻", name: "Crypto Hack", by: "Ármintb" },
  { key: "random", cls: "rand", ic: "🎲", name: "Random", by: "Surprise me!" },
];

export default function PlayScreen({ onPick, onBack }) {
  return (
    <div className="screen">
      <h2>Choose a Gamemode</h2>
      <div className="gm-grid">
        {MODES.map((m) => (
          <div className={`gm-card ${m.cls}`} key={m.key} onClick={() => onPick(m.key)}>
            <div className="banner">{m.ic}</div>
            <b>{m.name}</b>
            <p style={{ color: "var(--sub)", fontSize: ".85rem" }}>{m.by}</p>
          </div>
        ))}
      </div>
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Back</button>
    </div>
  );
}
