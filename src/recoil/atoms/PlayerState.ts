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
  isCustomTheme: boolean;
  // Timer state
  timerWorkTime: number;
  timerBreakTime: number;
  timerSecondsRemaining: number;
  isTimerRunning: boolean;
  timerMode: "work" | "break";
  isPiPActive: boolean;
  activeTab: "background" | "theme" | "timer" | "support";
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
      window.localStorage.getItem("scaling_disabled") || "false"
    ),
    bgImgUrl: window.localStorage.getItem("bgImgUrl") || "",
    isCustomTheme: window.localStorage.getItem("is_custom_theme") === "true",
    timerWorkTime: 25,
    timerBreakTime: 5,
    timerSecondsRemaining: 25 * 60,
    isTimerRunning: false,
    timerMode: "work",
    isPiPActive: false,
    activeTab: "background",
  },
});
