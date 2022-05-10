/// <reference types="vite-plugin-svgr/client" />
import { ReactComponent as PlayIcon } from "../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../icons/pause-icon.svg";
import { ReactComponent as SoundIcon } from "../../icons/sound-icon.svg";
import { ReactComponent as SongsIcon } from "../../icons/songs-icon.svg";
import "./player-style.css";
import { useEffect, useRef, useState } from "react";
import Slider from "../Slider";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import { SongsState } from "../../recoil/atoms/SongsState";
import { defaultSongs } from "../../constants/songs";
import { getAllSongs } from "../../utils/songs";

export type PlayerProps = {
  player: any;
};

function Player({ player }: PlayerProps) {
  const [videoMeta, setVideoMeta] = useState<any>({});
  const [volume, setVolume] = useState(0);
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [songsData] = useRecoilState(SongsState);
  const { isPlaying, activeSong } = playerData as any;
  const { songs, isLoading } = songsData as any;

  useEffect(() => {
    let timerId: any;

    if (player) {
      timerId = setInterval(() => {
        setVideoMeta({
          duration: player.playerInfo.duration,
          current: player.playerInfo.currentTime,
        });
      }, 1000);
      player?.setVolume?.(50);
      setVolume(50);
    }

    return () => clearInterval(timerId);
  }, [player]);

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

  const onPlayListClick = () =>
    setPlayerData((prev) => ({ ...prev, showSongsList: !prev.showSongsList }));

  const handlePrevClick = () => {
    const songIds = getAllSongs();

    const currIndex = songIds.findIndex((song: any) => song === activeSong);
    if (currIndex < 1) {
      setPlayerData((prev) => ({
        ...prev,
        activeSong: songIds[songIds.length - 1] || songIds[0],
      }));
    } else {
      setPlayerData((prev) => ({
        ...prev,
        activeSong: songIds[currIndex - 1] || songIds[0],
      }));
    }
  };

  const handleNextClick = () => {
    const songIds = getAllSongs();
    const currIndex = songIds.findIndex((song: any) => song === activeSong);

    if (currIndex >= songIds.length - 1) {
      setPlayerData((prev) => ({
        ...prev,
        activeSong: songIds[0],
      }));
    }
    {
      setPlayerData((prev) => ({
        ...prev,
        activeSong: songIds[currIndex + 1] || songIds[0],
      }));
    }
  };

  return (
    <div className="player-container">
      <div className="title">{player?.playerInfo?.videoData?.title}</div>
      <div className="player">
        <div className="progress">
          <div className="slidecontainer">
            <Slider
              min={0}
              max={videoMeta.duration}
              className="slider"
              value={videoMeta.current || 0}
              id="myRange"
              onInput={(e) => {
                const target = e.target as any;
                const val = parseInt(target.value);
                player.seekTo(val, true);
              }}
              background="rgb(0 13 53 / 36%)"
            />
          </div>
        </div>
        <div className="actions">
          <div className="secondary-actions">
            <button onClick={onPlayListClick}>
              <SongsIcon />
            </button>
            <button onClick={handlePrevClick} className="prev">
              <PlayIcon />
            </button>
          </div>
          <button onClick={() => onPlayPauseClick()} className="play-pause">
            {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
          </button>
          <div className="secondary-actions">
            <button onClick={handleNextClick} className="next">
              <PlayIcon />
            </button>
            <div className="volume">
              <SoundIcon />
              <Slider
                min={0}
                max={100}
                className="slider"
                value={volume}
                id="myRange"
                onInput={(e: any) => {
                  player.setVolume(e.target.value);
                  setVolume(e.target.value);
                }}
                style={{ transform: "scale(0.7)" }}
                color="#8b90ff"
                background="rgb(0 13 53 / 10%)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Player;
