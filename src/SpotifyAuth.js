const CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID"; // TODO: replace with your Spotify Client ID
const REDIRECT_URI = "https://belisario-afk.github.io/spotify-screensaver/callback.html";
const SCOPE = "user-read-currently-playing user-read-playback-state";

export function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
}

export function sha256(plain) {
  // returns Promise<ArrayBuffer>
  const encoder = new TextEncoder();
  return window.crypto.subtle.digest("SHA-256", encoder.encode(plain));
}

export function base64urlencode(a) {
  return btoa(String.fromCharCode(...new Uint8Array(a)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function getAccessToken() {
  return localStorage.getItem("spotify_access_token");
}

export async function loginWithSpotify() {
  const state = generateRandomString(16);
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await sha256(codeVerifier).then(base64urlencode);

  localStorage.setItem("spotify_auth_state", state);
  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const url = new URL("https://accounts.spotify.com/authorize");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("scope", SCOPE);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("code_challenge", codeChallenge);

  window.location = url;
}

// Called by callback.html
export async function handleRedirectCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");
  const storedState = localStorage.getItem("spotify_auth_state");
  if (state !== storedState) return;
  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json();
  if (data.access_token) {
    localStorage.setItem("spotify_access_token", data.access_token);
    window.location = "/";
  }
}

// Spotify API
export async function fetchCurrentTrack(token) {
  if (!token) return null;
  const resp = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (resp.status === 204 || resp.status >= 400) return null;
  return resp.json();
}