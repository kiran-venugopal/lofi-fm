import { atom } from "recoil";
import { defaultSongs } from "../../constants/songs";

export interface IPlayerState {
  isPlaying: boolean;
  showSongsList: boolean;
  activeSong: string;
  volume: number;
  isBuffering: boolean;
  scalingDisabled: boolean;
  bgImgUrl?: string;
}

export const PlayerState = atom<IPlayerState>({
  key: "PLAYER_STATE",
  default: {
    isPlaying: false,
    showSongsList: false,
    activeSong: window.localStorage.getItem("activeSong") || defaultSongs[0],
    volume: JSON.parse(window.localStorage.getItem("volume") || "50"),
    isBuffering: false,
    scalingDisabled: JSON.parse(
      window.localStorage.getItem("scaling_disabled") || "true"
    ),
    bgImgUrl: window.localStorage.getItem("bgImgUrl") || "",
  },
});
