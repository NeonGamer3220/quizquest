import React from "react";

export default function ComingSoon({ title, desc, onBack }) {
  return (
    <div className="screen">
      <div className="comingSoon">
        <h2>{title}</h2>
        <p>{desc}</p>
        <button className="btn primary" onClick={onBack}>← Back to Gamemodes</button>
      </div>
    </div>
  );
}
