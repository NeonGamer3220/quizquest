import React from "react";

const ITEMS = [
  { key: "create", ic: "➕", label: "Create" },
  { key: "discover", ic: "🧭", label: "Discover" },
  { key: "library", ic: "📚", label: "Library" },
  { key: "favorites", ic: "⭐", label: "Favorites" },
  { key: "history", ic: "🕓", label: "History" },
  { key: "homework", ic: "📝", label: "Homework" },
  { key: "play", ic: "🎮", label: "Play" },
  { key: "settings", ic: "⚙️", label: "Settings" },
  { key: "db", ic: "🗄️", label: "Database" },
];

export default function TeacherPanel({ onNav }) {
  return (
    <div className="screen">
      <h2>Teacher Panel</h2>
      <p style={{ color: "var(--sub)" }}>Welcome back! Pick where you want to go.</p>
      <div className="grid-nav">
        {ITEMS.map((it) => (
          <div className="nav-card" key={it.key} onClick={() => onNav(it.key)}>
            <span className="ic">{it.ic}</span>
            {it.label}
          </div>
        ))}
      </div>
    </div>
  );
}
