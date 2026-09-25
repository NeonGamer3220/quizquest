import React, { useEffect, useRef, useState } from "react";
import { SAMPLE_Q } from "../../data/questions.js";

const TARGET_GOLD = 300;

function rollReward() {
  const r = Math.random();
  if (r < 0.55) return { type: "gold", val: [10, 20, 40, 100][Math.floor(Math.random() * 4)] };
  if (r < 0.75) return { type: "double" };
  if (r < 0.85) return { type: "take", pct: 0.05 };
  if (r < 0.9) return { type: "take", pct: 0.1 };
  if (r < 0.94) return { type: "triple" };
  if (r < 0.965) return { type: "take", pct: 0.15 };
  if (r < 0.98) return { type: "take", pct: 0.25 };
  if (r < 0.995) return { type: "dragon", pct: [0.1, 0.25, 0.5][Math.floor(Math.random() * 3)] };
  return { type: "swap" };
}

export default function GoldQuest({ onExit, toast }) {
  const [qIndex, setQIndex] = useState(0);
  const [gold, setGold] = useState(0);
  const [dragon, setDragon] = useState(0);
  const [bots, setBots] = useState([
    { name: "Bot Alex", gold: 0, icon: "🤖" },
    { name: "Bot Zoe", gold: 0, icon: "🐱" },
  ]);
  const [phase, setPhase] = useState("question"); // question | chests | target
  const [answered, setAnswered] = useState(null); // index chosen or null
  const [secs, setSecs] = useState(15);
  const [targetKind, setTargetKind] = useState(null); // {kind:'take'|'swap', pct}
  const timerRef = useRef(null);

  const q = SAMPLE_Q[qIndex % SAMPLE_Q.length];

  function clearTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function runTimer(seconds, onEnd) {
    clearTimer();
    setSecs(seconds);
    let t = seconds;
    timerRef.current = setInterval(() => {
      t -= 1;
      setSecs(t);
      if (t <= 0) {
        clearTimer();
        onEnd();
      }
    }, 1000);
  }

  useEffect(() => {
    // start question timer on mount / whenever a new question appears
    if (phase === "question") {
      runTimer(15, () => handleAnswer(false));
    }
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, phase]);

  function botsGuess() {
    setBots((prev) =>
      prev.map((b) =>
        Math.random() < 0.6 ? { ...b, gold: b.gold + [10, 20, 40][Math.floor(Math.random() * 3)] } : b
      )
    );
  }

  function nextQuestion() {
    setAnswered(null);
    setQIndex((i) => i + 1);
    setPhase("question");
  }

  function handleAnswer(correct, idx = null) {
    clearTimer();
    setAnswered(idx);
    botsGuess();
    if (!correct) {
      toast("❌ Wrong! Waiting 3s...");
      setTimeout(nextQuestion, 3000);
      return;
    }
    setPhase("chests");
    runTimer(10, () => nextQuestion());
  }

  function openChest() {
    clearTimer();
    const reward = rollReward();
    if (reward.type === "gold") {
      setGold((g) => g + reward.val);
      toast(`💰 +${reward.val} gold!`);
      setTimeout(nextQuestion, 1200);
    } else if (reward.type === "double") {
      setGold((g) => g * 2);
      toast("✨ Double Gold!");
      setTimeout(nextQuestion, 1200);
    } else if (reward.type === "triple") {
      setGold((g) => g * 3);
      toast("🌟 TRIPLE GOLD!!");
      setTimeout(nextQuestion, 1200);
    } else if (reward.type === "dragon") {
      setGold((g) => {
        const lost = Math.floor(g * reward.pct);
        setDragon((d) => d + lost);
        toast(`🐉 Dragon took ${Math.round(reward.pct * 100)}%! (-${lost})`);
        return g - lost;
      });
      setTimeout(nextQuestion, 1200);
    } else {
      setTargetKind({ kind: reward.type, pct: reward.pct || 0 });
      setPhase("target");
      runTimer(10, () => { setTargetKind(null); nextQuestion(); });
    }
  }

  function resolveTarget(i) {
    clearTimer();
    const target = bots[i];
    if (targetKind.kind === "swap") {
      const mine = gold;
      setGold(target.gold);
      setBots((prev) => prev.map((b, bi) => (bi === i ? { ...b, gold: mine } : b)));
      toast(`🔁 Swapped gold with ${target.name}!`);
    } else {
      const amt = Math.floor(target.gold * targetKind.pct);
      setBots((prev) => prev.map((b, bi) => (bi === i ? { ...b, gold: b.gold - amt } : b)));
      setGold((g) => g + amt);
      toast(`💸 Took ${amt} from ${target.name}!`);
    }
    setTargetKind(null);
    setTimeout(nextQuestion, 1000);
  }

  useEffect(() => {
    if (gold >= TARGET_GOLD) {
      toast("🏆 Game Over — target reached!");
      clearTimer();
      setTimeout(onExit, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gold]);

  const leaderboard = [{ name: "You", gold, icon: "🧑" }, ...bots].sort((a, b) => b.gold - a.gold);
  const pct = Math.max(0, Math.min(100, (secs / (phase === "chests" || phase === "target" ? 10 : 15)) * 100));

  return (
    <div className="screen">
      <div className="hud">
        <span className="pill">🐉 Gold Quest</span>
        <span className="pill">💰 {gold}</span>
        <span className="pill">⏱ {secs}s</span>
      </div>

      {phase === "question" && (
        <>
          <div className="qBox">
            <h3>{q.q}</h3>
            <div className="timerBar"><div className="timerFill" style={{ width: pct + "%" }} /></div>
          </div>
          <div className="answers">
            {q.a.map((ans, i) => (
              <button
                key={i}
                className={`ans ${answered !== null ? (i === q.c ? "correct" : i === answered ? "wrong" : "") : ""}`}
                disabled={answered !== null}
                onClick={() => handleAnswer(i === q.c, i)}
              >
                {ans}
              </button>
            ))}
          </div>
        </>
      )}

      {phase === "chests" && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <h3>Pick a chest! ({secs}s)</h3>
          <div className="chests">
            {[0, 1, 2].map((i) => (
              <button key={i} className="chest" onClick={openChest}>📦</button>
            ))}
          </div>
        </div>
      )}

      {phase === "target" && targetKind && (
        <div className="card">
          <h3>{targetKind.kind === "swap" ? "🔁 SWAP — choose a player" : `💸 TAKE ${Math.round(targetKind.pct * 100)}% — choose a player`}</h3>
          {bots.map((b, i) => (
            <div className="card target-row" key={i} onClick={() => resolveTarget(i)}>
              {b.icon} {b.name} — 💰{b.gold}
            </div>
          ))}
        </div>
      )}

      <div className="card leaderboard" style={{ marginTop: 20 }}>
        <h3>Leaderboard</h3>
        {leaderboard.map((p, i) => (
          <div key={i}><span>{p.icon} {p.name}</span><span>💰{p.gold}</span></div>
        ))}
        <div style={{ opacity: 0.6 }}><span>🐉 Dragon Treasure</span><span>💰{dragon}</span></div>
      </div>
    </div>
  );
}
