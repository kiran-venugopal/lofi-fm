/// <reference types="vite-plugin-svgr/client" />
import "./player-style.css";
import { Fragment, useEffect, useReducer, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import { SongsState } from "../../recoil/atoms/SongsState";
import { defaultSongs } from "../../constants/songs";
import { getAllSongs, getVolume } from "../../utils/songs";
import useContainerClick from "use-container-click";
import axios from "axios";
import PlayerInfo from "./player-info";
import Controls from "./controls/Controls";
import Cashtab from "./cashtab";
import { initialPlayerState, playerReducer } from "./reducer/player-reducer";

export type PlayerProps = {
  player: any;
};

function Player({ player }: PlayerProps) {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [songsData, setSongsData] = useRecoilState(SongsState);
  const [playerState, dispatch] = useReducer(playerReducer, initialPlayerState);
  const infoRef = useRef(document.createElement("div"));

  const { videoMeta, isCashtabVisible, isInfoVisible } = playerState;
  const { playerInfo } = player;
  const { videoData } = playerInfo;
  const { title, author } = videoData;

  useContainerClick(infoRef, () => {
    if (infoRef.current) dispatch({ type: "SET_SHOW_INFO", payload: false }); // setShowInfo(false);
  });

  const { isPlaying, volume } = playerData as any;

  const getSongsData = async (id: string) => {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&key=${
        import.meta.env.VITE_YT_KEY
      }&id=${id}`
    );
    return response.data.items.map((item: any) => ({
      ...item.snippet,
      id: item.id,
    }));
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const songsIds = getAllSongs();
      const songsArr = await getSongsData(songsIds.join(","));
      console.log({ songsArr });
      setSongsData((prev) => ({ ...prev, songs: songsArr, isLoading: false }));
    };
    fetchSongs();
    window.oncontextmenu = () => {
      dispatch({ type: "SET_SHOW_INFO", payload: true });
    };

    if (window.location.pathname.includes("ecash")) {
      dispatch({
        type: "SET_SHOW_CASHTAB",
        payload: true,
      });
    }
  }, []);

  useEffect(() => {
    let timerId: any;

    if (player) {
      timerId = setInterval(() => {
        dispatch({
          type: "SET_VIDEO_META",
          payload: {
            duration: player.playerInfo.duration,
            current: player.playerInfo.currentTime,
          },
        });
      }, 1000);
      const vol = getVolume();
      player?.setVolume?.(vol);
      setPlayerData((prev) => ({ ...prev, volume: vol }));
      window.player = player;
    }

    return () => clearInterval(timerId);
  }, [player]);

  useEffect(() => {
    const handler = () => {
      if (!playerData.isPlaying) {
        player.playVideo();
      }
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, [player, playerData.isPlaying]);

  const onPlayPauseClick = () =>
    setPlayerData((prev) => {
      if (player) {
        if (!prev.isPlaying) {
          player.playVideo();
        } else player.pauseVideo();
        return { ...prev, isPlaying: !prev.isPlaying };
      }

      return prev;
    });

  const onPlayListClick = () => {
    setPlayerData((prev) => ({ ...prev, showSongsList: !prev.showSongsList }));
    dispatch({
      type: "SET_SHOW_CASHTAB",
      payload: false,
    });
  };

  const handleInfoClick = () => {
    setPlayerData((prev) => ({ ...prev, showSongsList: false }));
    // setShowInfo((prev) => (prev === null ? false : true));
    dispatch({
      type: "SET_SHOW_INFO",
      payload: !isInfoVisible,
    });
    //setCTOpen(false);
    dispatch({
      type: "SET_SHOW_CASHTAB",
      payload: false,
    });
  };

  const handlePrevClick = () => {
    let activeSong = playerData.activeSong;
    let currIndex = defaultSongs.findIndex((s) => s === activeSong);

    if (songsData.isLoading) {
      if (currIndex <= 0) {
        activeSong = defaultSongs[defaultSongs.length - 1];
      } else {
        activeSong = defaultSongs[currIndex - 1];
      }
    } else {
      const songs: any[] = songsData.songs;
      currIndex = songs.findIndex((s: any) => s.id === activeSong);
      if (currIndex <= 0) {
        activeSong = songs[songs.length - 1].id;
      } else {
        activeSong = songs[currIndex - 1].id;
      }
    }

    setPlayerData((prev) => ({
      ...prev,
      activeSong,
    }));
    window.localStorage.setItem("activeSong", activeSong);
  };

  const handleNextClick = () => {
    const songs = songsData.isLoading ? defaultSongs : (songsData.songs as any);
    let activeSong = playerData.activeSong;
    const currIndex: number = songsData.isLoading
      ? defaultSongs.findIndex((s: any) => s === activeSong)
      : songs.findIndex((song: any) => song.id === activeSong);

    console.log({ activeSong, songs, currIndex });

    if (currIndex >= songs.length - 1) {
      activeSong = defaultSongs[0];
    } else {
      activeSong =
        (songsData.isLoading
          ? songs[currIndex + 1]
          : songs[currIndex + 1].id) || defaultSongs[0];
    }

    setPlayerData((prev) => ({
      ...prev,
      activeSong,
    }));

    window.localStorage.setItem("activeSong", activeSong);
  };

  const handleEcashClick = () => {
    dispatch({ type: "SET_SHOW_INFO", payload: false });
    dispatch({ type: "SET_SHOW_CASHTAB", payload: true });
  };

  const handleVolumeChange = (e: any) => {
    player.setVolume(e.target.value);
    setPlayerData((prev) => ({
      ...prev,
      volume: e.target.value,
    }));
    window.localStorage.setItem("volume", JSON.stringify(e.target.value));
  };

  const handleProgressChange = (e: any) => {
    const target = e.target as any;
    const val = parseInt(target.value);
    player.seekTo(val, true);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {isInfoVisible && (
        <PlayerInfo
          onEcashClick={handleEcashClick}
          player={player}
          infoRef={infoRef}
        />
      )}
      {isCashtabVisible && (
        <Cashtab
          onClose={() => dispatch({ type: "SET_SHOW_CASHTAB", payload: false })}
        />
      )}
      <Controls
        title={title}
        author={author}
        volume={volume}
        isPlaying={isPlaying}
        onPlayPauseClick={onPlayPauseClick}
        onVolumeChange={handleVolumeChange}
        onPrevClick={handlePrevClick}
        onNextClick={handleNextClick}
        onPlayListClick={onPlayListClick}
        onProgressChange={handleProgressChange}
        duration={videoMeta.duration || 0}
        currentDuration={videoMeta.current || 0}
        onInfoClick={handleInfoClick}
      />
    </div>
  );
}

export default Player;
