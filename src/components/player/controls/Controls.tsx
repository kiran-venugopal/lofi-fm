import Slider from "../../Slider";
import { ReactComponent as PlayIcon } from "../../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../../icons/pause-icon.svg";
import { ReactComponent as SoundIcon } from "../../../icons/sound-icon.svg";
import { ReactComponent as SongsIcon } from "../../../icons/songs-icon.svg";
import { ReactComponent as InfoIcon } from "../../../icons/info-icon.svg";
import { ReactComponent as DragIcon } from "../../../icons/drag-icon.svg";
import "./controls-styles.css";
import { useRef } from "react";

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
  const controlRef = useRef(document.createElement("section"));

  const handleDrag = (e: any) => {
    if (e.clientX === 0 || e.clientY === 0) return;
    let x =
      e.clientX - controlRef.current.offsetWidth + e.target.offsetWidth / 2;
    let y = e.clientY;
    // x = (x / window.innerWidth) * 100;
    // y = (y / window.innerHeight) * 100;

    controlRef.current.style.setProperty(
      "transform",
      `translate(${x}px,${y}px)`
    );
  };

  return (
    <section ref={controlRef} className="controls">
      <div className="volume">
        <Slider
          min={0}
          max={100}
          className="slider"
          value={volume}
          id="myRange"
          onInput={onVolumeChange}
          color="#8b90ff"
          background="rgb(0 13 53 / 10%)"
          orientation="vertical"
          varient="small"
        />
        <SoundIcon />
      </div>
      <div className="primary-controls">
        <div className="progress">
          <div className="slidecontainer">
            <Slider
              min={0}
              max={duration}
              className="slider"
              value={currentDuration}
              id="myRange"
              onInput={onProgressChange}
              background="rgb(0 13 53 / 36%)"
            />
          </div>
        </div>
        <div className="main">
          <div className="play-pause-container">
            <button onClick={() => onPlayPauseClick()} className="play-pause">
              {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
            </button>
          </div>
          <div className="music-actions">
            <button onClick={onPrevClick} className="prev">
              <PlayIcon />
            </button>
            <div className="title">
              <div className="name">{title}</div>
              <div className="author">{author}</div>
            </div>
            <button onClick={onNextClick} className="next">
              <PlayIcon />
            </button>
          </div>
        </div>
      </div>
      <div className="secondary-actions">
        <button
          onDrag={handleDrag}
          draggable
          onDragEnd={(e: any) => {
            e.target.style.setProperty("opacity", "1");
          }}
          onDragOver={(e: any) => {
            e.dataTransfer.dropEffect = "move";
            e.preventDefault();
          }}
          onDragEnter={(e) => {
            e.preventDefault();
          }}
          onDragStart={(e: any) => {
            console.log(e.target);
            e.target.style.setProperty("opacity", "0");
          }}
        >
          <DragIcon />
        </button>
        <button onClick={onPlayListClick}>
          <SongsIcon />
        </button>
        <button onClick={onInfoClick}>
          <InfoIcon style={{ paddingLeft: 0 }} />
        </button>
      </div>
    </section>
  );
}

export default Controls;
