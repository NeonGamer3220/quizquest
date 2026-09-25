import React, { useState } from "react";
import { store } from "../store.js";

export default function LoginScreen({ onAuth, onBack }) {
  const [tab, setTab] = useState("login");
  const [liUser, setLiUser] = useState("");
  const [liPass, setLiPass] = useState("");
  const [reUser, setReUser] = useState("");
  const [rePass, setRePass] = useState("");

  function doRegister() {
    if (!reUser.trim() || !rePass) return;
    store.register(reUser.trim(), rePass);
    setTab("login");
  }
  function doLogin() {
    const u = store.login(liUser.trim() || "Teacher", liPass);
    onAuth(u);
  }

  return (
    <div className="screen" id="loginScreen">
      <div className="authBox">
        <div className="tabs">
          <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Log In</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Register</button>
        </div>
        {tab === "login" ? (
          <div>
            <input placeholder="Username" value={liUser} onChange={(e) => setLiUser(e.target.value)} />
            <input type="password" placeholder="Password" value={liPass} onChange={(e) => setLiPass(e.target.value)} />
            <button className="btn primary" style={{ width: "100%" }} onClick={doLogin}>Log In</button>
          </div>
        ) : (
          <div>
            <input placeholder="Username" value={reUser} onChange={(e) => setReUser(e.target.value)} />
            <input type="password" placeholder="Password" value={rePass} onChange={(e) => setRePass(e.target.value)} />
            <button className="btn primary" style={{ width: "100%" }} onClick={doRegister}>Create Account</button>
          </div>
        )}
        <button className="btn" style={{ width: "100%", marginTop: 10 }} onClick={onBack}>← Back</button>
      </div>
    </div>
  );
}
