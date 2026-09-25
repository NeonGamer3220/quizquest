import React, { useEffect, useRef, useState } from "react";
import { SAMPLE_Q } from "../../data/questions.js";

const TARGET_CRYPTO = 300;
const WORD_BANK = ["nebula", "quartz", "falcon", "tundra", "ember", "cipher", "vortex", "onyx", "pixel", "raptor"];

function rollReward() {
  const r = Math.random();
  if (r < 0.55) return { type: "crypto", val: [10, 20, 40, 100][Math.floor(Math.random() * 4)] };
  if (r < 0.75) return { type: "double" };
  if (r < 0.85) return { type: "take", pct: 0.05 };
  if (r < 0.9) return { type: "take", pct: 0.1 };
  if (r < 0.94) return { type: "triple" };
  if (r < 0.965) return { type: "take", pct: 0.15 };
  if (r < 0.98) return { type: "take", pct: 0.25 };
  if (r < 0.995) return { type: "dragon", pct: [0.1, 0.25, 0.5][Math.floor(Math.random() * 3)] };
  return { type: "swap" };
}
function pickWords(n) {
  const pool = [...WORD_BANK].sort(() => Math.random() - 0.5);
  return pool.slice(0, n);
}

export default function CryptoHack({ onExit, toast }) {
  const [setupDone, setSetupDone] = useState(false);
  const [choices5] = useState(() => pickWords(5));
  const [myPassword, setMyPassword] = useState(null);

  const [qIndex, setQIndex] = useState(0);
  const [crypto, setCrypto] = useState(0);
  const [vault, setVault] = useState(0); // "the exchange" — crypto-flavored dragon
  const [bots, setBots] = useState([
    { name: "Bot Alex", crypto: 0, icon: "🤖", password: pickWords(1)[0] },
    { name: "Bot Zoe", crypto: 0, icon: "🐱", password: pickWords(1)[0] },
  ]);
  const [phase, setPhase] = useState("question");
  const [answered, setAnswered] = useState(null);
  const [secs, setSecs] = useState(15);
  const [targetKind, setTargetKind] = useState(null);
  const [guessTarget, setGuessTarget] = useState(null); // bot being hacked
  const [guessOptions, setGuessOptions] = useState([]);
  const timerRef = useRef(null);

  const q = SAMPLE_Q[qIndex % SAMPLE_Q.length];

  function clearTimer() { if (timerRef.current) clearInterval(timerRef.current); }
  function runTimer(seconds, onEnd) {
    clearTimer();
    setSecs(seconds);
    let t = seconds;
    timerRef.current = setInterval(() => {
      t -= 1; setSecs(t);
      if (t <= 0) { clearTimer(); onEnd(); }
    }, 1000);
  }

  useEffect(() => {
    if (setupDone && phase === "question") runTimer(15, () => handleAnswer(false));
    return clearTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex, phase, setupDone]);

  function botsGuess() {
    setBots((prev) => prev.map((b) => (Math.random() < 0.6 ? { ...b, crypto: b.crypto + [10, 20, 40][Math.floor(Math.random() * 3)] } : b)));
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
      toast("❌ Access denied! Waiting 3s...");
      setTimeout(nextQuestion, 3000);
      return;
    }
    setPhase("chests");
    runTimer(10, () => nextQuestion());
  }

  function openChest() {
    clearTimer();
    const reward = rollReward();
    if (reward.type === "crypto") { setCrypto((g) => g + reward.val); toast(`🪙 +${reward.val} crypto!`); setTimeout(nextQuestion, 1200); }
    else if (reward.type === "double") { setCrypto((g) => g * 2); toast("✨ Double crypto!"); setTimeout(nextQuestion, 1200); }
    else if (reward.type === "triple") { setCrypto((g) => g * 3); toast("🌟 TRIPLE CRYPTO!!"); setTimeout(nextQuestion, 1200); }
    else if (reward.type === "dragon") {
      setCrypto((g) => {
        const lost = Math.floor(g * reward.pct);
        setVault((v) => v + lost);
        toast(`🏦 The Exchange seized ${Math.round(reward.pct * 100)}%! (-${lost})`);
        return g - lost;
      });
      setTimeout(nextQuestion, 1200);
    } else {
      setTargetKind({ kind: reward.type, pct: reward.pct || 0 });
      setPhase("target");
      runTimer(10, () => { setTargetKind(null); nextQuestion(); });
    }
  }

  function pickHackTarget(i) {
    clearTimer();
    const target = bots[i];
    const opts = new Set([target.password]);
    while (opts.size < 3) opts.add(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]);
    setGuessOptions([...opts].sort(() => Math.random() - 0.5));
    setGuessTarget(i);
    runTimer(10, () => { toast("⌛ Hack timed out!"); setGuessTarget(null); nextQuestion(); });
  }

  function guessPassword(word) {
    clearTimer();
    const i = guessTarget;
    const target = bots[i];
    if (word !== target.password) {
      toast(`🔒 Wrong password! Hack on ${target.name} failed.`);
      setGuessTarget(null);
      setTimeout(nextQuestion, 1000);
      return;
    }
    if (targetKind.kind === "swap") {
      const mine = crypto;
      setCrypto(target.crypto);
      setBots((prev) => prev.map((b, bi) => (bi === i ? { ...b, crypto: mine } : b)));
      toast(`🔁 Hacked in! Swapped crypto with ${target.name}!`);
    } else {
      const amt = Math.floor(target.crypto * targetKind.pct);
      setBots((prev) => prev.map((b, bi) => (bi === i ? { ...b, crypto: b.crypto - amt } : b)));
      setCrypto((g) => g + amt);
      toast(`💰 Hacked in! Took ${amt} from ${target.name}!`);
    }
    setGuessTarget(null);
    setTargetKind(null);
    setTimeout(nextQuestion, 1000);
  }

  useEffect(() => {
    if (crypto >= TARGET_CRYPTO) {
      toast("🏆 Game Over — target reached!");
      clearTimer();
      setTimeout(onExit, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crypto]);

  if (!setupDone) {
    return (
      <div className="screen">
        <h2>💻 Crypto Hack — Choose your password</h2>
        <p style={{ color: "var(--sub)" }}>Other players will need to guess this to hack your wallet. Pick wisely!</p>
        <div className="gm-grid">
          {choices5.map((w) => (
            <div
              key={w}
              className={`gm-card crypto ${myPassword === w ? "selected" : ""}`}
              style={myPassword === w ? { outline: "3px solid var(--gold)" } : {}}
              onClick={() => setMyPassword(w)}
            >
              <div className="banner">🔑</div>
              <b>{w}</b>
            </div>
          ))}
        </div>
        <button className="btn primary" style={{ marginTop: 20 }} disabled={!myPassword} onClick={() => setSetupDone(true)}>
          Confirm & Start →
        </button>
      </div>
    );
  }

  const leaderboard = [{ name: "You", crypto, icon: "🧑" }, ...bots].sort((a, b) => b.crypto - a.crypto);
  const pct = Math.max(0, Math.min(100, (secs / (phase === "chests" || phase === "target" ? 10 : 15)) * 100));

  return (
    <div className="screen">
      <div className="hud">
        <span className="pill">💻 Crypto Hack</span>
        <span className="pill">🪙 {crypto}</span>
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
          <h3>Crack a vault! ({secs}s)</h3>
          <div className="chests">
            {[0, 1, 2].map((i) => <button key={i} className="chest" onClick={openChest}>🗝️</button>)}
          </div>
        </div>
      )}

      {phase === "target" && targetKind && guessTarget === null && (
        <div className="card">
          <h3>{targetKind.kind === "swap" ? "🔁 SWAP — choose a target" : `💰 TAKE ${Math.round(targetKind.pct * 100)}% — choose a target`}</h3>
          {bots.map((b, i) => (
            <div className="card target-row" key={i} onClick={() => pickHackTarget(i)}>
              {b.icon} {b.name} — 🪙{b.crypto}
            </div>
          ))}
        </div>
      )}

      {guessTarget !== null && (
        <div className="card">
          <h3>🔓 Guess {bots[guessTarget].name}'s password ({secs}s)</h3>
          <div className="answers">
            {guessOptions.map((w) => (
              <button key={w} className="ans" onClick={() => guessPassword(w)}>{w}</button>
            ))}
          </div>
        </div>
      )}

      <div className="card leaderboard" style={{ marginTop: 20 }}>
        <h3>Leaderboard</h3>
        {leaderboard.map((p, i) => <div key={i}><span>{p.icon} {p.name}</span><span>🪙{p.crypto}</span></div>)}
        <div style={{ opacity: 0.6 }}><span>🏦 The Exchange</span><span>🪙{vault}</span></div>
      </div>
    </div>
  );
}
