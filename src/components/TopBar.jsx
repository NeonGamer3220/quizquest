import React, { useState } from "react";

export default function TopBar({ user, onNav, onLogout }) {
  const [open, setOpen] = useState(false);
  if (!user) return null;
  return (
    <div id="topbar">
      <div className="brand">🟣 QuizQuest</div>
      <div id="account">
        <span style={{ fontSize: ".9rem", color: "var(--sub)" }}>{user}</span>
        <div className="avatar" onClick={() => setOpen((o) => !o)}>
          {user[0]?.toUpperCase()}
        </div>
        {open && (
          <div id="accMenu">
            <button onClick={() => { setOpen(false); onNav("settings"); }}>⚙️ Settings</button>
            <button onClick={onLogout}>🚪 Log out</button>
          </div>
        )}
      </div>
    </div>
  );
}
