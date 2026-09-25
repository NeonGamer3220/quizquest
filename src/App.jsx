import React, { useState } from "react";
import { store } from "./store.js";
import { library } from "./libraryStore.js";
import { useToast } from "./hooks/useToast.js";
import { useRoom } from "./hooks/useRoom.js";

import TopBar from "./components/TopBar.jsx";
import JoinScreen from "./components/JoinScreen.jsx";
import LoginScreen from "./components/LoginScreen.jsx";
import TeacherPanel from "./components/TeacherPanel.jsx";
import DatabaseScreen from "./components/DatabaseScreen.jsx";
import PlayScreen from "./components/PlayScreen.jsx";
import Lobby from "./components/Lobby.jsx";
import CreatePage from "./components/panel/CreatePage.jsx";
import DiscoverPage from "./components/panel/DiscoverPage.jsx";
import LibraryPage from "./components/panel/LibraryPage.jsx";
import FavoritesPage from "./components/panel/FavoritesPage.jsx";
import HistoryPage from "./components/panel/HistoryPage.jsx";
import HomeworkPage from "./components/panel/HomeworkPage.jsx";
import SettingsPage from "./components/panel/SettingsPage.jsx";
import GoldQuest from "./components/games/GoldQuest.jsx";
import FishingFrenzy from "./components/games/FishingFrenzy.jsx";
import CryptoHack from "./components/games/CryptoHack.jsx";
import ComingSoon from "./components/ComingSoon.jsx";

export default function App() {
  const [screen, setScreen] = useState("join");
  const [user, setUser] = useState(null);
  const [ldm, setLdm] = useState(false);
  const [activeMode, setActiveMode] = useState(null);
  const [toastMsg, toast] = useToast();
  const room = useRoom();

  function go(name) { setScreen(name); }

  function resolveMode(mode) {
    if (mode === "random") {
      const opts = ["gold", "fish", "crypto"];
      mode = opts[Math.floor(Math.random() * opts.length)];
      toast("🎲 Random picked: " + { gold: "Gold Quest", fish: "Fishing Frenzy", crypto: "Crypto Hack" }[mode]);
    }
    return mode;
  }

  // Host: create a room from the Play screen, then start a mode from the Lobby
  function hostAndPick(fromSet) {
    if (fromSet) toast(`🎟️ Hosting a room — custom questions from "${fromSet.title}" plug in next; using the sample bank for now.`);
    room.hostRoom();
    go("lobby");
  }
  function handleStart(mode) {
    const resolved = resolveMode(mode);
    room.startGame(resolved);
    launchMode(resolved);
  }
  function launchMode(mode) {
    store.incGames();
    library.logHistory({ mode });
    setActiveMode(mode);
    go("game");
  }
  // Player: joins a room from the Join screen
  function handleJoin(code, nick) {
    room.joinRoom(code, nick);
    go("lobby");
  }

  // if a non-host player's room receives a "start" broadcast, follow along
  React.useEffect(() => {
    if (room.started && screen === "lobby") launchMode(room.started);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.started]);

  return (
    <div className={ldm ? "ldm" : "hi-detail"}>
      <div className="bgBlobs" aria-hidden="true"><span></span><span></span><span></span></div>
      <TopBar user={user} onNav={go} onLogout={async () => { await store.logout(); setUser(null); go("join"); }} />

      {screen === "join" && (
        <JoinScreen ldm={ldm} setLdm={setLdm} onHost={() => go("login")} toast={toast} onJoin={handleJoin} connected={room.connected} />
      )}
      {screen === "login" && (
        <LoginScreen onAuth={(u) => { setUser(u); go("panel"); }} onBack={() => go("join")} />
      )}
      {screen === "panel" && <TeacherPanel onNav={go} />}
      {screen === "create" && <CreatePage onBack={() => go("panel")} toast={toast} />}
      {screen === "discover" && <DiscoverPage onBack={() => go("panel")} onHost={hostAndPick} />}
      {screen === "library" && <LibraryPage onBack={() => go("panel")} onHost={hostAndPick} toast={toast} />}
      {screen === "favorites" && <FavoritesPage onBack={() => go("panel")} onHost={hostAndPick} />}
      {screen === "history" && <HistoryPage onBack={() => go("panel")} />}
      {screen === "homework" && <HomeworkPage onBack={() => go("panel")} toast={toast} />}
      {screen === "settings" && (
        <SettingsPage
          user={user}
          ldm={ldm}
          setLdm={setLdm}
          onBack={() => go("panel")}
          onLogout={async () => { await store.logout(); setUser(null); go("join"); }}
        />
      )}
      {screen === "db" && <DatabaseScreen onBack={() => go("panel")} />}
      {screen === "play" && <PlayScreen onPick={hostAndPick} onBack={() => go("panel")} />}
      {screen === "lobby" && (
        <Lobby code={room.code} players={room.players} isHost={room.isHost} onStartPick={handleStart} onBack={() => go(user ? "panel" : "join")} />
      )}
      {screen === "game" && activeMode === "gold" && <GoldQuest onExit={() => go(user ? "panel" : "join")} toast={toast} />}
      {screen === "game" && activeMode === "fish" && <FishingFrenzy onExit={() => go(user ? "panel" : "join")} toast={toast} />}
      {screen === "game" && activeMode === "crypto" && <CryptoHack onExit={() => go(user ? "panel" : "join")} toast={toast} />}
      {screen === "soon" && <ComingSoon title="" desc="" onBack={() => go("play")} />}

      {toastMsg && <div className="toast">{toastMsg}</div>}
    </div>
  );
}
