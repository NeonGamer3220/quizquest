import { useEffect, useRef, useState, useCallback } from "react";
import { supabase, supabaseReady } from "../lib/supabaseClient.js";

// Real-time lobby using Supabase Realtime Presence + Broadcast.
// Host creates a channel named "room:<code>", tracks itself in presence,
// players joining the same code show up live. Host can broadcast a
// "start" event that all joined clients receive instantly.
function randomCode() {
  return Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function useRoom() {
  const [code, setCode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const [started, setStarted] = useState(null); // mode name once host starts
  const channelRef = useRef(null);

  const teardown = useCallback(() => {
    if (channelRef.current) {
      supabase?.removeChannel(channelRef.current);
      channelRef.current = null;
    }
  }, []);

  function subscribe(roomCode, selfName, asHost) {
    if (!supabaseReady) return; // demo mode: no real sync available
    teardown();
    const ch = supabase.channel(`room:${roomCode}`, { config: { presence: { key: selfName } } });
    ch.on("presence", { event: "sync" }, () => {
      const state = ch.presenceState();
      const list = Object.entries(state).map(([key, metas]) => ({
        name: key,
        host: metas[0]?.host || false,
      }));
      setPlayers(list);
    });
    ch.on("broadcast", { event: "start" }, ({ payload }) => {
      setStarted(payload.mode);
    });
    ch.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await ch.track({ host: asHost, joinedAt: Date.now() });
      }
    });
    channelRef.current = ch;
  }

  function hostRoom() {
    const c = randomCode();
    setCode(c);
    setIsHost(true);
    subscribe(c, "Host", true);
    return c;
  }

  function joinRoom(roomCode, nickname) {
    setCode(roomCode);
    setIsHost(false);
    subscribe(roomCode, nickname || "Player", false);
  }

  function startGame(mode) {
    setStarted(mode);
    channelRef.current?.send({ type: "broadcast", event: "start", payload: { mode } });
  }

  useEffect(() => teardown, [teardown]);

  return { code, players, isHost, started, hostRoom, joinRoom, startGame, connected: supabaseReady };
}
