import React, { useState } from "react";

export default function JoinScreen({ ldm, setLdm, onHost, toast, onJoin, connected }) {
  const [code, setCode] = useState("");
  const [nick, setNick] = useState("");

  function joinGame() {
    if (!code.trim()) return toast("Enter a game code");
    if (!connected) return toast("Demo mode: real room joining needs Supabase keys (see README)");
    onJoin(code.trim().toUpperCase(), nick.trim() || "Player");
  }

  return (
    <div className="screen" id="joinScreen">
      <div className="logo-big">QuizQuest</div>
      <input
        placeholder="GAME CODE"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
      />
      <input
        placeholder="Nickname"
        className="nickInput"
        value={nick}
        onChange={(e) => setNick(e.target.value)}
      />
      <button className="btn primary" onClick={joinGame}>Join Game</button>
      <button className="btn" onClick={onHost}>I'm a Teacher / Host →</button>
      <label className="ldmToggle">
        <input type="checkbox" checked={ldm} onChange={(e) => setLdm(e.target.checked)} />
        Low Detail Mode (for tablets)
      </label>
      {!connected && (
        <p style={{ color: "var(--sub)", fontSize: ".75rem", maxWidth: 300 }}>
          Running in local demo mode. Add Supabase keys to enable real accounts and cross-device rooms.
        </p>
      )}
    </div>
  );
}
