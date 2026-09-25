import React, { useEffect, useRef, useState } from "react";
import { SAMPLE_Q } from "../../data/questions.js";

const TARGET_WEIGHT = 150; // kg
const ROUND_SECONDS = 180;

const FISH = [
  { name: "Minnow", emoji: "🐟", min: 1, max: 20 },
  { name: "Bass", emoji: "🐠", min: 5, max: 35 },
  { name: "Salmon", emoji: "🐡", min: 10, max: 55 },
  { name: "Shark", emoji: "🦈", min: 25, max: 90 },
  { name: "Whale", emoji: "🐋", min: 60, max: 200 },
];

const UPGRADES = [
  { key: "lure", name: "Lure Level", desc: "Better lures hook rarer, heavier fish.", cost: 40, max: 5 },
  { key: "line", name: "Stronger Line", desc: "Less chance a big catch snaps your line.", cost: 35, max: 3 },
  { key: "boat", name: "Faster Boat", desc: "Cuts your reel-in wait time.", cost: 50, max: 3 },
];

function rollFish(lureLevel, luckBoost) {
  // higher lure level biases toward rarer fish tiers
  const tierRoll = Math.min(4, Math.floor(Math.random() * (2 + lureLevel) * (luckBoost ? 1.5 : 1)));
  const tier = FISH[Math.min(tierRoll, FISH.length - 1)];
  const weight = Math.round((tier.min + Math.random() * (tier.max - tier.min)) * 10) / 10;
  return { ...tier, weight };
}

export default function FishingFrenzy({ onExit, toast }) {
  const [qIndex, setQIndex] = useState(0);
  const [phase, setPhase] = useState("question"); // question | reel | upgrade
  const [answered, setAnswered] = useState(null);
  const [secs, setSecs] = useState(15);
  const [totalWeight, setTotalWeight] = useState(0);
  const [coins, setCoins] = useState(20);
  const [catches, setCatches] = useState([]);
  const [levels, setLevels] = useState({ lure: 0, line: 0, boat: 0 });
  const [frenzy, setFrenzy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const timerRef = useRef(null);
  const roundRef = useRef(null);
  const frenzyRef = useRef(null);

  const q = SAMPLE_Q[qIndex % SAMPLE_Q.length];

  function clearQTimer() { if (timerRef.current) clearInterval(timerRef.current); }
  function runQTimer(seconds, onEnd) {
    clearQTimer();
    setSecs(seconds);
    let t = seconds;
    timerRef.current = setInterval(() => {
      t -= 1; setSecs(t);
      if (t <= 0) { clearQTimer(); onEnd(); }
    }, 1000);
  }

  // overall round countdown
  useEffect(() => {
    roundRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(roundRef.current); finishRound(true); return 0; }
        return t - 1;
      });
    }, 1000);
    // frenzy event every 60-120s
    scheduleFrenzy();
    return () => { clearInterval(roundRef.current); clearInterval(frenzyRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scheduleFrenzy() {
    const delay = (60 + Math.random() * 60) * 1000;
    frenzyRef.current = setTimeout(() => {
      setFrenzy(true);
      toast("🌊 FISHING FRENZY! 2x reel speed + 50% luck boost for 20s");
      setTimeout(() => { setFrenzy(false); scheduleFrenzy(); }, 20000);
    }, delay);
  }

  useEffect(() => {
    if (phase === "question") runQTimer(15, () => handleAnswer(false));
    return clearQTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, phase]);

  function nextQuestion() {
    setAnswered(null);
    setQIndex((i) => i + 1);
    setPhase("question");
  }

  function handleAnswer(correct, idx = null) {
    clearQTimer();
    setAnswered(idx);
    if (!correct) {
      toast("❌ Wrong! Waiting 3s...");
      setTimeout(nextQuestion, 3000);
      return;
    }
    setPhase("reel");
  }

  function reelIn() {
    const reelMs = (frenzy ? 500 : 1000) - levels.boat * 100;
    toast("🎣 Reeling in...");
    setTimeout(() => {
      const fish = rollFish(levels.lure, frenzy);
      const snapped = Math.random() < Math.max(0, 0.08 - levels.line * 0.02) && fish.weight > 60;
      if (snapped) {
        toast("💥 The line snapped! Lost the catch.");
      } else {
        setTotalWeight((w) => Math.round((w + fish.weight) * 10) / 10);
        setCoins((c) => c + Math.round(fish.weight / 3));
        setCatches((c) => [{ ...fish, id: Date.now() }, ...c].slice(0, 6));
        toast(`${fish.emoji} Caught a ${fish.name} — ${fish.weight}kg!`);
      }
      nextQuestion();
    }, Math.max(reelMs, 300));
  }

  function buyUpgrade(key) {
    const lvl = levels[key];
    const def = UPGRADES.find((u) => u.key === key);
    const cost = def.cost * (lvl + 1);
    if (lvl >= def.max) return toast("Already maxed out!");
    if (coins < cost) return toast("Not enough coins!");
    setCoins((c) => c - cost);
    setLevels((l) => ({ ...l, [key]: l[key] + 1 }));
    toast(`⬆️ ${def.name} upgraded to level ${lvl + 1}!`);
  }

  function finishRound(timeUp) {
    clearQTimer(); clearInterval(roundRef.current); clearTimeout(frenzyRef.current);
    toast(timeUp ? `⏱ Time's up! Final weight: ${totalWeight}kg` : "🏆 Target weight reached!");
    setTimeout(onExit, 2200);
  }

  useEffect(() => {
    if (totalWeight >= TARGET_WEIGHT) finishRound(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalWeight]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secLeft = String(timeLeft % 60).padStart(2, "0");
  const pct = Math.max(0, Math.min(100, (secs / 15) * 100));

  return (
    <div className="screen">
      <div className="hud">
        <span className="pill">🎣 Fishing Frenzy{frenzy ? " 🌊 FRENZY" : ""}</span>
        <span className="pill">⚖️ {totalWeight}kg / {TARGET_WEIGHT}kg</span>
        <span className="pill">🪙 {coins}</span>
        <span className="pill">⏳ {mins}:{secLeft}</span>
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

      {phase === "reel" && (
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <h3>Cast your line!</h3>
          <button className="chest" onClick={reelIn}>🎣</button>
          <p style={{ color: "var(--sub)" }}>Lure Lv.{levels.lure} · Line Lv.{levels.line} · Boat Lv.{levels.boat}</p>
          <button className="btn gold" onClick={() => setPhase("upgrade")}>🛒 Upgrade Shop</button>
        </div>
      )}

      {phase === "upgrade" && (
        <div className="card">
          <h3>🛒 Upgrade Shop</h3>
          {UPGRADES.map((u) => (
            <div className="card" key={u.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <b>{u.name}</b> (Lv.{levels[u.key]}/{u.max})
                <p style={{ color: "var(--sub)", fontSize: ".85rem", margin: 0 }}>{u.desc}</p>
              </div>
              <button className="btn gold" onClick={() => buyUpgrade(u.key)}>
                {levels[u.key] >= u.max ? "MAX" : `🪙${u.cost * (levels[u.key] + 1)}`}
              </button>
            </div>
          ))}
          <button className="btn primary" style={{ width: "100%" }} onClick={() => setPhase("reel")}>← Back to fishing</button>
        </div>
      )}

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Recent catches</h3>
        <div className="playerChips">
          {catches.length === 0 && <span style={{ color: "var(--sub)" }}>No catches yet — answer a question to cast!</span>}
          {catches.map((c) => <span className="chip" key={c.id}>{c.emoji} {c.name} {c.weight}kg</span>)}
        </div>
      </div>
    </div>
  );
}
