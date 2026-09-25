import React from "react";
import { store } from "../../store.js";

export default function SettingsPage({ user, ldm, setLdm, onBack, onLogout }) {
  return (
    <div className="screen">
      <h2>⚙️ Settings</h2>
      <div className="card">
        <h3>Account</h3>
        <p style={{ color: "var(--sub)" }}>Signed in as <b style={{ color: "var(--text)" }}>{user}</b></p>
        <p style={{ color: "var(--sub)", fontSize: ".85rem" }}>
          {store.ready ? "Connected to Supabase." : "Running in local demo mode (no Supabase keys detected)."}
        </p>
        <button className="btn" onClick={onLogout}>🚪 Log out</button>
      </div>
      <div className="card">
        <h3>Display</h3>
        <label className="ldmToggle">
          <input type="checkbox" checked={ldm} onChange={(e) => setLdm(e.target.checked)} />
          Low Detail Mode (disables glow/animations — better for tablets)
        </label>
      </div>
      <div className="card">
        <h3>Theme</h3>
        <p style={{ color: "var(--sub)" }}>Black-Purple (default) — more themes coming soon.</p>
      </div>
      <button className="btn" style={{ marginTop: 10 }} onClick={onBack}>← Back to Panel</button>
    </div>
  );
}
