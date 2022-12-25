import Slider from "../../Slider";
import { ReactComponent as PlayIcon } from "../../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../../icons/pause-icon.svg";
import { ReactComponent as SoundIcon } from "../../../icons/sound-icon.svg";
import { ReactComponent as SongsIcon } from "../../../icons/songs-icon.svg";
import { ReactComponent as InfoIcon } from "../../../icons/info-icon.svg";
import "./controls-styles.css";

export type ControlsPropsType = {
  title: string;
  author: string;
  onPlayListClick(): void;
  onPrevClick(): void;
  onPlayPauseClick(): void;
  isPlaying: boolean;
  onNextClick(): void;
  volume: number;
  onVolumeChange: React.FormEventHandler<HTMLInputElement>;
  currentDuration: number;
  duration: number;
  onProgressChange: React.FormEventHandler<HTMLInputElement>;
  onInfoClick(): void;
};

function Controls({
  title = "Some title",
  author = "Author",
  onPlayListClick,
  onPrevClick,
  onPlayPauseClick,
  isPlaying,
  onNextClick,
  volume = 70,
  onVolumeChange,
  currentDuration,
  duration,
  onProgressChange,
  onInfoClick,
}: ControlsPropsType) {
  return (
    <div className="controls">
      <div className="title">
        <div className="name">{title}</div>
        <div className="author">- {author}</div>
      </div>
      <div className="progress">
        <div className="slidecontainer">
          {!!duration && !!currentDuration && (
            <Slider
              min={0}
              max={duration}
              className="slider"
              value={currentDuration}
              id="myRange"
              onInput={onProgressChange}
              background="rgb(0 13 53 / 36%)"
            />
          )}
        </div>
      </div>
      <div className="actions">
        <div className="secondary-actions">
          <div className="left-section">
            <button onClick={onInfoClick}>
              <InfoIcon style={{ paddingLeft: 0 }} />
            </button>
            <button onClick={onPlayListClick}>
              <SongsIcon />
            </button>
          </div>
          <button onClick={onPrevClick} className="prev">
            <PlayIcon />
          </button>
        </div>
        <button onClick={() => onPlayPauseClick()} className="play-pause">
          {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
        </button>
        <div className="secondary-actions">
          <button onClick={onNextClick} className="next">
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
              onInput={onVolumeChange}
              style={{ transform: "scale(0.7)" }}
              color="#8b90ff"
              background="rgb(0 13 53 / 10%)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controls;
