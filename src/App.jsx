import React, { useEffect, useState } from "react";
import { getAccessToken, loginWithSpotify, fetchCurrentTrack } from "./SpotifyAuth";
import Visualizer from "./Visualizer";
import Player from "./Player";

export default function App() {
  const [token, setToken] = useState(null);
  const [track, setTrack] = useState(null);

  useEffect(() => {
    const t = getAccessToken();
    setToken(t);
    if (t) pollTrack(t);
    // eslint-disable-next-line
  }, []);

  // Poll current playing every 2 seconds
  function pollTrack(token) {
    const fetchTrack = async () => {
      const data = await fetchCurrentTrack(token);
      setTrack(data);
    };
    fetchTrack();
    const id = setInterval(fetchTrack, 2000);
    return () => clearInterval(id);
  }

  if (!token)
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#111",
        color: "#fff"
      }}>
        <h1>Spotify Screensaver Player</h1>
        <button
          style={{ fontSize: "1.5rem", padding: "1em 2em" }}
          onClick={loginWithSpotify}
        >
          Sign in with Spotify
        </button>
      </div>
    );

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      position: "relative",
      background: "#111"
    }}>
      <Visualizer track={track} />
      <Player track={track} />
    </div>
  );
}