import React, { useState } from "react";
import { store } from "./store.js";
import { useToast } from "./hooks/useToast.js";

import TopBar from "./components/TopBar.jsx";
import JoinScreen from "./components/JoinScreen.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import TeacherPanel from "./components/TeacherPanel.jsx";
import GenericPage from "./components/GenericPage.jsx";
import DatabaseScreen from "./components/DatabaseScreen.jsx";
import PlayScreen from "./components/PlayScreen.jsx";
import GoldQuest from "./components/games/GoldQuest.jsx";
import ComingSoon from "./components/ComingSoon.jsx";

export default function App() {
  const [screen, setScreen] = useState("join");
  const [user, setUser] = useState(null);
  const [ldm, setLdm] = useState(false);
  const [soon, setSoon] = useState({ title: "", desc: "" });
  const [toastMsg, toast] = useToast();

  function go(name) {
    setScreen(name);
  }

  function startGame(mode) {
    if (mode === "random") {
      const opts = ["gold", "fish", "crypto"];
      mode = opts[Math.floor(Math.random() * opts.length)];
      toast(
        "🎲 Random picked: " +
          { gold: "Gold Quest", fish: "Fishing Frenzy", crypto: "Crypto Hack" }[mode]
      );
    }
    if (mode === "fish") {
      setSoon({
        title: "🎣 Fishing Frenzy",
        desc: "Rod upgrades, 5 lure levels, and frenzy events are next on the build list.",
      });
      return go("soon");
    }
    if (mode === "crypto") {
      setSoon({
        title: "💻 Crypto Hack",
        desc: "Password-guess swap mechanic on top of the Gold Quest engine is next.",
      });
      return go("soon");
    }
    store.incGames();
    go("game-gold");
  }

  return (
    <div className={ldm ? "ldm" : "hi-detail"}>
      <TopBar user={user} onNav={go} onLogout={() => { setUser(null); go("join"); }} />
      {screen === "join" && (
        <JoinScreen ldm={ldm} setLdm={setLdm} onHost={() => go("login")} toast={toast} />
      )}
      {screen === "login" && (
        <LoginScreen
          onAuth={(u) => {
            setUser(u);
            go("panel");
          }}
          onBack={() => go("join")}
        />
      )}
      {screen === "panel" && <TeacherPanel onNav={go} />}
      {["create", "discover", "library", "favorites", "history", "homework", "settings"].includes(
        screen
      ) && <GenericPage name={screen} onBack={() => go("panel")} />}
      {screen === "db" && <DatabaseScreen onBack={() => go("panel")} />}
      {screen === "play" && <PlayScreen onPick={startGame} onBack={() => go("panel")} />}
      {screen === "game-gold" && <GoldQuest onExit={() => go("play")} toast={toast} />}
      {screen === "soon" && (
        <ComingSoon title={soon.title} desc={soon.desc} onBack={() => go("play")} />
      )}
      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
