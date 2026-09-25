import React from "react";

const MODES = [
  { cls: "gold", ic: "🐉", name: "Gold Quest", by: "TT_Buur" },
  { cls: "fish", ic: "🎣", name: "Fishing Frenzy", by: "SABADAmars" },
  { cls: "crypto", ic: "💻", name: "Crypto Hack", by: "Ármintb" },
  { cls: "rand", ic: "🎲", name: "Random", by: "Surprise me!" },
];

export default function PlayScreen({ onPick, onBack }) {
  return (
    <div className="screen">
      <h2>Host a Game</h2>
      <p style={{ color: "var(--sub)" }}>Create a room, share the code with your class, then pick a gamemode from the lobby.</p>
      <div className="gm-grid">
        {MODES.map((m) => (
          <div className={`gm-card ${m.cls}`} key={m.name}>
            <div className="banner">{m.ic}</div>
            <b>{m.name}</b>
            <p style={{ color: "var(--sub)", fontSize: ".85rem" }}>{m.by}</p>
          </div>
        ))}
      </div>
      <button className="btn primary" style={{ marginTop: 20 }} onClick={onPick}>🎟️ Create Room →</button>
      <button className="btn" style={{ marginTop: 10 }} onClick={onBack}>← Back</button>
    </div>
  );
}
