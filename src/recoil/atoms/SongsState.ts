import { atom } from "recoil";

export interface ISongsState {
  songs: any[];
  starredIds: string[];
  isLoading: boolean;
}

export const SongsState = atom<ISongsState>({
  key: "SONGS_STATE",
  default: {
    songs: [],
    starredIds: JSON.parse(window.localStorage.getItem("starred") || "[]"),
    isLoading: true,
  },
});
