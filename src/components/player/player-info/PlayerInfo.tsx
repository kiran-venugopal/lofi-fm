import { ReactComponent as YoutubeIcon } from "../../../icons/youtube-icon.svg";
import { ReactComponent as GithubIcon } from "../../../icons/github-icon.svg";
import { ReactComponent as BMFIcon } from "../../../icons/bmf-icon.svg";
import { ReactComponent as EcashIcon } from "../../../icons/ecash-icon.svg";
import { ReactComponent as Logo } from "../../../icons/lofifm.svg";
import { ReactComponent as PlayIcon } from "../../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../../icons/pause-icon.svg";
import { MutableRefObject, useRef, useState } from "react";
import "./player-info-style.css";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../../recoil/atoms/PlayerState";
import {
  defaultTheme,
  getThemeColor,
  setThemeColor,
  ThemeColorType,
} from "../../../utils/theme";
import { makeDebounced } from "../../../utils/common";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import giphys from "../../../constants/giphys";

export type PlayerInfoProps = {
  infoRef: MutableRefObject<any>;
  player: any;
  onEcashClick(): void;
  handleTogglePiP(): void;
};

const debouncedThemeChange = makeDebounced(
  (
    color: string,
    type: ThemeColorType,
    setTheme: React.Dispatch<any>,
    setPlayerData: any
  ) => {
    setThemeColor(type, color);
    setTheme((prev: any) => ({
      ...prev,
      [type]: color,
    }));
    setPlayerData((prev: any) => {
      if (prev.isCustomTheme) return prev;
      window.localStorage.setItem("is_custom_theme", "true");
      return {
        ...prev,
        isCustomTheme: true,
      };
    });
  },
  100
);

function PlayerInfo({ infoRef, player, onEcashClick, handleTogglePiP }: PlayerInfoProps) {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [theme, setTheme] = useState({
    primary: getThemeColor("primary"),
    secondary: getThemeColor("secondary"),
  });
  const urlInputRef = useRef<HTMLInputElement>(null);

  const isDocPiPSupported = typeof window !== "undefined" && "documentPictureInPicture" in window;
  const isPiPSupported = isDocPiPSupported || (typeof document !== "undefined" && "pictureInPictureEnabled" in document);

  const handleSetUrl = () => {
    setPlayerData((prev) => ({
      ...prev,
      bgImgUrl: urlInputRef.current?.value,
    }));
    window.localStorage.setItem("bgImgUrl", urlInputRef.current?.value || "");
  };

  const handleHeaderClick = () =>
    window.open("https://www.producthunt.com/products/lofi-fm");

  const handleScalingChange = (e: any) => {
    const isChecked = e.target.checked;
    setPlayerData((prev) => ({
      ...prev,
      scalingDisabled: e.target.checked,
    }));
    window.localStorage.setItem("scaling_disabled", JSON.stringify(isChecked));
  };

  const handleThemeReset = () => {
    setThemeColor("primary", defaultTheme.primary);
    setThemeColor("secondary", defaultTheme.secondary);
    setTheme({
      primary: defaultTheme.primary,
      secondary: defaultTheme.secondary,
    });
    setPlayerData((prev) => ({
      ...prev,
      isCustomTheme: false,
    }));
    window.localStorage.setItem("is_custom_theme", "false");
  };

  const handleThemeChange = (type: ThemeColorType) => (e: any) => {
    debouncedThemeChange(e.target.value, type, setTheme, setPlayerData);
  };

  const handleTabChange = (value: string) => {
    setPlayerData((prev) => ({
      ...prev,
      activeTab: value as any,
    }));
  };

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const timeStr = formatTime(playerData.timerSecondsRemaining);

  return (
    <div className="player-info" ref={infoRef}>
      <div onClick={handleHeaderClick} className="header">
        <div className="logo">
          <Logo />
        </div>
        <div className="app-name">LoFi Fm</div>
      </div>

      <Tabs
        value={playerData.activeTab || "background"}
        onValueChange={handleTabChange}
        className="tabs-root"
      >
        <TabsList className="tabs-list" aria-label="Player settings tabs">
          <TabsTrigger className="tabs-trigger" value="background">
            Background
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="theme">
            Theme
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="timer">
            Timer
          </TabsTrigger>
          <TabsTrigger className="tabs-trigger" value="support">
            Other
          </TabsTrigger>
        </TabsList>

        <TabsContent className="tabs-content" value="background">
          <div className="settings">
            <div className="disable-scaling">
              <label
                title="disable scaling to view background video in original size"
                className="switch"
              >
                <input
                  type="checkbox"
                  checked={playerData.scalingDisabled}
                  onChange={handleScalingChange}
                />
                <span className="slider"></span>
                <span className="text">Disable Scaling</span>
              </label>
            </div>
          </div>
          <div className="bg-image">
            <input
              ref={urlInputRef}
              type="text"
              placeholder="Background GIF/image url"
              defaultValue={playerData.bgImgUrl}
            />
            <button onClick={handleSetUrl} className="btn">
              Set background
            </button>
            <button
              onClick={() => {
                setPlayerData((prev) => ({
                  ...prev,
                  bgImgUrl: "",
                }));
                window.localStorage.setItem("bgImgUrl", "");
              }}
              className="btn remove-btn"
            >
              Remove
            </button>
          </div>
          <div className="bg-tiles">
            {giphys.map((giphy) => (
              <div
                key={giphy.id}
                className="bg-tile"
                onClick={() => {
                  const bgUrl = `/gifs/${giphy.id}`;
                  setPlayerData((prev) => ({
                    ...prev,
                    bgImgUrl: bgUrl,
                  }));
                  window.localStorage.setItem("bgImgUrl", bgUrl);
                }}
              >
                <img
                  src={`/gifs/${giphy.id}`}
                  alt={giphy.user?.name || "Background"}
                />
                {playerData.bgImgUrl === `/gifs/${giphy.id}` && (
                  <div className="selected-overlay">✓</div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent className="tabs-content" value="theme">
          <div className="settings">
            <div className="themeing">
              <section>
                <label>Primary</label>
                <input
                  onChange={handleThemeChange("primary")}
                  type="color"
                  className="primary"
                  value={theme.primary}
                />
              </section>
              <section>
                <label>Secondary</label>
                <input
                  onChange={handleThemeChange("secondary")}
                  type="color"
                  className="primary"
                  value={theme.secondary}
                />
              </section>
              <section>
                <button onClick={handleThemeReset} className="btn">
                  Reset
                </button>
              </section>
            </div>
          </div>
        </TabsContent>

        <TabsContent className="tabs-content" value="timer">
          <div className="settings">
            <div className="timer-container">
              <div className="timer-status break-label">
                {playerData.timerMode === "work" ? "Focus" : "Break"}
              </div>
              <div className={`timer-display ${playerData.timerSecondsRemaining === 0 ? "blinking" : ""}`}>{timeStr}</div>

              <div className="timer-inputs">
                <div className="timer-input-group">
                  <label>Focus (min)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={playerData.timerWorkTime}
                    disabled={playerData.isTimerRunning}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 0);
                      setPlayerData((prev) => {
                        const newSecs = prev.timerMode === "work" ? val * 60 : prev.timerSecondsRemaining;
                        return {
                          ...prev,
                          timerWorkTime: val,
                          timerSecondsRemaining: newSecs,
                        };
                      });
                    }}
                  />
                </div>
                <div className="timer-input-group">
                  <label>Break (min)</label>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={playerData.timerBreakTime}
                    disabled={playerData.isTimerRunning}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 0);
                      setPlayerData((prev) => {
                        const newSecs = prev.timerMode === "break" ? val * 60 : prev.timerSecondsRemaining;
                        return {
                          ...prev,
                          timerBreakTime: val,
                          timerSecondsRemaining: newSecs,
                        };
                      });
                    }}
                  />
                </div>
              </div>

              <div className="timer-controls">
                <button
                  onClick={() => {
                    setPlayerData((prev) => ({
                      ...prev,
                      isTimerRunning: !prev.isTimerRunning,
                    }));
                  }}
                  className="btn"
                >
                  {playerData.isTimerRunning ? <PauseIcon /> : <PlayIcon />}
                  <span>{playerData.isTimerRunning ? "Pause" : "Start"}</span>
                </button>
                <button
                  onClick={() => {
                    setPlayerData((prev) => ({
                      ...prev,
                      isTimerRunning: false,
                      timerMode: "work",
                      timerSecondsRemaining: prev.timerWorkTime * 60,
                    }));
                  }}
                  className="btn"
                >
                  <span>↺ Reset</span>
                </button>
                {isPiPSupported && (
                  <button onClick={handleTogglePiP} className="btn">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                      <rect x="13" y="13" width="8" height="6" rx="1" fill="currentColor" />
                    </svg>
                    <span>{playerData.isPiPActive ? "Exit PiP" : "PiP"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent className="tabs-content" value="support">
          <div className="resources">
            <button
              onClick={() => window.open(player?.playerInfo?.videoUrl)}
              className="btn"
            >
              <YoutubeIcon />
              <span>Play in Youtube</span>
            </button>
            <button
              onClick={() =>
                window.open("https://github.com/kiran-venugopal/lofi")
              }
              className="btn gh"
            >
              <GithubIcon />
              <span>Sourcecode</span>
            </button>
            <button
              onClick={() => window.open("https://www.buymeacoffee.com/kiranv")}
              className="btn bmf"
            >
              <BMFIcon />

              <span>Buy me Coffee</span>
            </button>
            <button onClick={onEcashClick} className="btn cashtab">
              <EcashIcon />
              <span>eCash</span>
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PlayerInfo;
