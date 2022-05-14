import { atom } from "recoil";
import { defaultSongs } from "../../constants/songs";

export const PlayerState = atom({
  key: "PLAYER_STATE",
  default: {
    isPlaying: false,
    showSongsList: false,
    activeSong: window.localStorage.getItem("activeSong") || defaultSongs[0],
    volume: JSON.parse(window.localStorage.getItem("volume") || "50"),
  },
});
