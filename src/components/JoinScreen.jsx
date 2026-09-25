import React, { useState } from "react";

export default function JoinScreen({ ldm, setLdm, onHost, toast }) {
  const [code, setCode] = useState("");
  const [nick, setNick] = useState("");

  function joinGame() {
    if (!code.trim()) return toast("Enter a game code");
    toast(`Joined as ${nick || "Player"}! (host controls launch)`);
  }

  return (
    <div className="screen" id="joinScreen">
      <div className="logo-big">QuizQuest</div>
      <input
        placeholder="GAME CODE"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <input
        placeholder="Nickname"
        style={{
          padding: 10,
          borderRadius: 10,
          border: "1px solid var(--purple)",
          background: "var(--panel)",
          color: "var(--text)",
          width: 230,
        }}
        value={nick}
        onChange={(e) => setNick(e.target.value)}
      />
      <button className="btn primary" onClick={joinGame}>Join Game</button>
      <button className="btn" onClick={onHost}>I'm a Teacher / Host →</button>
      <label className="ldmToggle">
        <input type="checkbox" checked={ldm} onChange={(e) => setLdm(e.target.checked)} />
        Low Detail Mode (for tablets)
      </label>
    </div>
  );
}
