import { defaultSongs } from "../constants/songs";

export function getAllSongs() {
  const addedSongs = JSON.parse(
    window.localStorage.getItem("addedSongs") || "[]"
  );
  const songsIds = addedSongs.concat(defaultSongs);
  return songsIds;
}

export function getAddedSongs() {
  return JSON.parse(window.localStorage.getItem("addedSongs") || "[]");
}
