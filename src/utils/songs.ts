import { defaultSongs } from "../constants/songs";

export function getAllSongs() {
  const addedSongs = JSON.parse(
    window.localStorage.getItem("addedSongs") || "[]"
  );
  const songsIds = addedSongs.concat(defaultSongs);
  return [...new Set(songsIds)];
}

export function getAddedSongs() {
  return JSON.parse(window.localStorage.getItem("addedSongs") || "[]");
}

export function getVolume() {
  return JSON.parse(window.localStorage.getItem("volume") || "50");
}

export function generateRandomIndex(maxLimit = defaultSongs.length - 1) {
  let rand = Math.random() * maxLimit;
  rand = Math.floor(rand);

  return rand;
}
