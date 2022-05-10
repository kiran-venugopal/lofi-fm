import { atom } from "recoil";

export const SongsState = atom({
  key: "SONGS_STATE",
  default: {
    songs: [],
    starredIds: JSON.parse(window.localStorage.getItem("starred") || "[]"),
    isLoading: true,
  },
});
