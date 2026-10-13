import Slider from "../../Slider";
import { ReactComponent as PlayIcon } from "../../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../../icons/pause-icon.svg";
import { ReactComponent as SoundIcon } from "../../../icons/sound-icon.svg";
import { ReactComponent as SongsIcon } from "../../../icons/songs-icon.svg";
import { ReactComponent as InfoIcon } from "../../../icons/info-icon.svg";
import { ReactComponent as DragIcon } from "../../../icons/drag-icon.svg";
import { ReactComponent as NextIcon } from "../../../icons/next-icon.svg";
import "./controls-styles.css";
import { useEffect, useReducer, useRef } from "react";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { useRecoilState } from "recoil";
import { SongsState } from "../../../recoil/atoms/SongsState";
import { PlayerState } from "../../../recoil/atoms/PlayerState";
import IconButton from "../../common/IconButton";
import { trackEvent } from "../../../utils/ga";

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
  isInfoVisible: boolean;
  onMiniTimerClick(): void;
};

function Controls({
  title = "",
  author = "",
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
  isInfoVisible,
  onMiniTimerClick,
}: ControlsPropsType) {
  const controlRef = useRef(document.createElement("section"));
  const dragData = useRef({
    isActive: false,
    offsetX: 0,
    offsetY: 0,
    hasMoved: false,
  });
  const [songsData] = useRecoilState(SongsState);
  const [playerData] = useRecoilState(PlayerState);

  const songMeta = songsData.songs.find(
    (song) => song.id === playerData.activeSong && song.iframeUrl
  );

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const isWorkMode = playerData.timerMode === "work";
  const initialSeconds = isWorkMode ? playerData.timerWorkTime * 60 : playerData.timerBreakTime * 60;
  const hasProgress = playerData.timerSecondsRemaining < initialSeconds;
  const showMiniTimer = !isInfoVisible && (playerData.isTimerRunning || hasProgress);

  const startDrag = (clientX: number, clientY: number) => {
    if (!controlRef.current) return;
    const rect = controlRef.current.getBoundingClientRect();
    dragData.current = {
      isActive: true,
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top,
      hasMoved: false,
    };
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!controlRef.current || !dragData.current.isActive) return;
    dragData.current.hasMoved = true;

    let x = clientX - dragData.current.offsetX;
    let y = clientY - dragData.current.offsetY;

    const controlWidth =
      controlRef.current.offsetWidth ||
      controlRef.current.getBoundingClientRect().width;
    const controlHeight =
      controlRef.current.offsetHeight ||
      controlRef.current.getBoundingClientRect().height;

    const minX = 0;
    const maxX = Math.max(0, window.innerWidth - controlWidth);
    const minY = 0;
    const maxY = Math.max(0, window.innerHeight - controlHeight);

    x = Math.min(Math.max(x, minX), maxX);
    y = Math.min(Math.max(y, minY), maxY);

    controlRef.current.style.setProperty(
      "transform",
      `translate(${x}px,${y}px)`
    );
  };

  const endDrag = () => {
    if (dragData.current.isActive && dragData.current.hasMoved) {
      trackEvent("Controls Dragged");
    }
    dragData.current.isActive = false;
    dragData.current.hasMoved = false;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (dragData.current.isActive) {
        updatePosition(event.clientX, event.clientY);
      }
    };

    const handleMouseUp = () => {
      endDrag();
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (dragData.current.isActive) {
        if (event.cancelable) {
          event.preventDefault();
        }
        if (event.touches.length > 0) {
          updatePosition(event.touches[0].clientX, event.touches[0].clientY);
        }
      }
    };

    const handleTouchEnd = () => {
      endDrag();
    };

    const alignToBottomCenter = () => {
      if (dragData.current.isActive) return;
      const height = window.innerHeight;
      const width = window.innerWidth;

      let x = width / 2 - controlRef.current.scrollWidth / 2;
      let y = height - controlRef.current.scrollHeight - 25;
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
    };

    alignToBottomCenter();
    window.addEventListener("resize", alignToBottomCenter);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
      window.removeEventListener("resize", alignToBottomCenter);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <section
      ref={controlRef}
      className={`controls ${songMeta ? "spotify-active" : ""} ${showMiniTimer ? "has-timer" : ""}`}
    >
      <div className="top-section">
        {!songMeta && (
          <div className="title">
            <div className="author">{author}</div>
            <div className="name">{title}</div>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto" }}>
          {showMiniTimer && (
            <div className="mini-timer" onClick={onMiniTimerClick}>
              ⏱️ {formatTime(playerData.timerSecondsRemaining)}
            </div>
          )}
          <IconButton
            style={{ marginBottom: songMeta ? "5px" : "unset" }}
            className="drag-btn"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            icon={<DragIcon />}
          />
        </div>
      </div>
      {!songMeta && (
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
      )}

      <div className="primary-controls">
        <div className="main">
          {!songMeta ? (
            <div className="music-actions">
              <IconButton onClick={onPrevClick} className="prev" icon={<NextIcon />} />
              <IconButton
                onClick={() => onPlayPauseClick()}
                className="play-pause"
                icon={isPlaying ? <PauseIcon /> : <PlayIcon className="play" />}
              />
              <IconButton onClick={onNextClick} className="next" icon={<NextIcon />} />
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
          ) : (
            <iframe
              data-testid="embed-iframe"
              className="spotify-iframe"
              src={`${songMeta.iframeUrl}&theme=0`}
              width="326px"
              height="80px"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ position: "relative", top: "-30px" }}
            ></iframe>
          )}
          <div className="secondary-actions">
            <IconButton onClick={onPlayListClick} icon={<SongsIcon />} />
            <PopoverTrigger asChild>
              <IconButton onClick={onInfoClick} icon={<InfoIcon style={{ paddingLeft: 0 }} />} />
            </PopoverTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Controls;
