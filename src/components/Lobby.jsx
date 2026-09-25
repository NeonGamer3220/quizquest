import React from "react";

export default function Lobby({ code, players, isHost, onStartPick, onBack }) {
  return (
    <div className="screen">
      <h2>🎟️ Room Lobby</h2>
      <div className="card" style={{ textAlign: "center" }}>
        <p style={{ color: "var(--sub)", marginBottom: 4 }}>Game code</p>
        <div className="roomCode">{code}</div>
      </div>
      <div className="card">
        <h3>Players ({players.length})</h3>
        <div className="playerChips">
          {players.length === 0 && <span style={{ color: "var(--sub)" }}>Waiting for players to join…</span>}
          {players.map((p) => (
            <span className="chip" key={p.name}>{p.host ? "🧑‍🏫 " : "🙋 "}{p.name}</span>
          ))}
        </div>
      </div>
      {isHost ? (
        <>
          <p style={{ color: "var(--sub)" }}>Pick a gamemode to start the room:</p>
          <div className="gm-grid">
            <div className="gm-card gold" onClick={() => onStartPick("gold")}><div className="banner">🐉</div><b>Gold Quest</b></div>
            <div className="gm-card fish" onClick={() => onStartPick("fish")}><div className="banner">🎣</div><b>Fishing Frenzy</b></div>
            <div className="gm-card crypto" onClick={() => onStartPick("crypto")}><div className="banner">💻</div><b>Crypto Hack</b></div>
            <div className="gm-card rand" onClick={() => onStartPick("random")}><div className="banner">🎲</div><b>Random</b></div>
          </div>
        </>
      ) : (
        <p style={{ color: "var(--sub)" }}>Waiting for the host to start the game…</p>
      )}
      <button className="btn" style={{ marginTop: 20 }} onClick={onBack}>← Leave Room</button>
    </div>
  );
}
