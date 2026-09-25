import React, { useState } from "react";
import { store } from "../store.js";

export default function LoginScreen({ onAuth, onBack }) {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [uname, setUname] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function doRegister() {
    setErr(""); setBusy(true);
    const { error } = await store.register(uname.trim(), email.trim(), pass);
    setBusy(false);
    if (error) return setErr(error.message);
    setTab("login");
  }
  async function doLogin() {
    setErr(""); setBusy(true);
    const { user, error } = await store.login(email.trim(), pass);
    setBusy(false);
    if (error) return setErr(error.message);
    onAuth(user);
  }

  return (
    <div className="screen" id="loginScreen">
      <div className="authBox">
        {!store.ready && (
          <p style={{ color: "var(--gold)", fontSize: ".8rem", marginBottom: 10 }}>
            ⚠️ Demo mode — add your Supabase keys to .env to enable real accounts.
          </p>
        )}
        <div className="tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Log In</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
        </div>
        {tab === "login" ? (
          <div>
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <button className="btn primary" style={{ width: "100%" }} disabled={busy} onClick={doLogin}>
              {busy ? "..." : "Log In"}
            </button>
          </div>
        ) : (
          <div>
            <input placeholder="Username" value={uname} onChange={(e) => setUname(e.target.value)} />
            <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
            <button className="btn primary" style={{ width: "100%" }} disabled={busy} onClick={doRegister}>
              {busy ? "..." : "Create Account"}
            </button>
          </div>
        )}
        {err && <p style={{ color: "var(--danger)", fontSize: ".85rem", marginTop: 10 }}>{err}</p>}
        <button className="btn" style={{ width: "100%", marginTop: 10 }} onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}
