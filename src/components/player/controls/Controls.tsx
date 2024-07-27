import Slider from "../../Slider";
import { ReactComponent as PlayIcon } from "../../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../../icons/pause-icon.svg";
import { ReactComponent as SoundIcon } from "../../../icons/sound-icon.svg";
import { ReactComponent as SongsIcon } from "../../../icons/songs-icon.svg";
import { ReactComponent as InfoIcon } from "../../../icons/info-icon.svg";
import { ReactComponent as DragIcon } from "../../../icons/drag-icon.svg";
import { ReactComponent as NextIcon } from "../../../icons/next-icon.svg";
import "./controls-styles.css";
import { useEffect, useRef } from "react";
import { PopoverTrigger } from "@radix-ui/react-popover";

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
  const dragData = useRef({ isActive: false });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragData.current.isActive) {
        let x = event.pageX - controlRef.current.offsetWidth + 20;
        if (x >= window.innerWidth - 150) {
          x = window.innerWidth - 150;
        }

        let y = event.pageY - 10;
        if (y >= window.innerHeight) {
          y = window.innerHeight;
        }

        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }

        controlRef.current.style.setProperty(
          "transform",
          `translate(${x}px,${y}px)`
        );
      }
    };

    const handleMouseUp = () => {
      dragData.current.isActive = false;
    };

    const alignToBottomCenter = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;

      let x = width / 2 - controlRef.current.scrollWidth / 2;
      let y = height - controlRef.current.scrollHeight - 25;
      if (x < 0) {
        x = 0;
      }
      controlRef.current.style.setProperty(
        "transform",
        `translate(${x}px,${y}px)`
      );
    };

    alignToBottomCenter();
    window.addEventListener("resize", alignToBottomCenter);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", alignToBottomCenter);
    };
  }, []);

  const handleMouseDown = (e: any) => {
    dragData.current.isActive = true;
  };

  return (
    <section ref={controlRef} className="controls">
      <div className="top-section">
        <div className="title">
          <div className="author">{author}</div>
          <div className="name">{title}</div>
        </div>
        <button className="drag-btn" onMouseDown={handleMouseDown}>
          <DragIcon />
        </button>
      </div>
      <div className="progress">
        <div className="slidecontainer">
          <Slider
            min={0}
            max={duration}
            className="slider"
            value={currentDuration}
            id="myRange"
            onInput={onProgressChange}
            background="rgb(24 24 24 / 36%)"
          />
        </div>
      </div>

      <div className="primary-controls">
        <div className="main">
          <div className="music-actions">
            <button onClick={onPrevClick} className="prev">
              <NextIcon />
            </button>
            <button onClick={() => onPlayPauseClick()} className="play-pause">
              {isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
            </button>
            <button onClick={onNextClick} className="next">
              <NextIcon />
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
                color="var(--secondary_color)"
                background="rgb(24 24 24 / 10%)"
                orientation="horizontal"
                varient="small"
              />
            </div>
          </div>
          <div className="secondary-actions">
            <button onClick={onPlayListClick}>
              <SongsIcon />
            </button>
            <PopoverTrigger onClick={onInfoClick}>
              <InfoIcon style={{ paddingLeft: 0 }} />
            </PopoverTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Controls;
