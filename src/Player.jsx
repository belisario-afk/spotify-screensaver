import React from "react";

export default function Player({ track }) {
  if (!track || !track.item) return null;
  const { item, is_playing } = track;
  return (
    <div style={{
      position: "absolute",
      bottom: 32,
      left: 32,
      color: "#fff",
      background: "rgba(0,0,0,0.6)",
      borderRadius: 16,
      padding: 24,
      maxWidth: 400,
      boxShadow: "0 4px 32px #000a"
    }}>
      <img
        src={item.album.images[0]?.url}
        alt=""
        width={80}
        height={80}
        style={{
          float: "left",
          marginRight: 16,
          borderRadius: 8,
          boxShadow: "0 0 24px #222"
        }}
      />
      <div>
        <div style={{ fontSize: "1.2em", fontWeight: 600 }}>{item.name}</div>
        <div style={{ fontSize: "1em", opacity: 0.9 }}>{item.artists.map(a => a.name).join(", ")}</div>
        <div style={{ fontSize: "0.9em", opacity: 0.7 }}>{item.album.name}</div>
        <div style={{ marginTop: 8 }}>
          {is_playing ? "▶️ Playing" : "⏸️ Paused"}
        </div>
      </div>
    </div>
  );
}