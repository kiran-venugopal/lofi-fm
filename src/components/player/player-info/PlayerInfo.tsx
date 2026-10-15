import { ReactComponent as YoutubeIcon } from "../../../icons/youtube-icon.svg";
import { ReactComponent as GithubIcon } from "../../../icons/github-icon.svg";
import { ReactComponent as BMFIcon } from "../../../icons/bmf-icon.svg";
import { ReactComponent as EcashIcon } from "../../../icons/ecash-icon.svg";
import { ReactComponent as Logo } from "../../../icons/lofifm.svg";
import { ReactComponent as PlayIcon } from "../../../icons/play-icon.svg";
import { ReactComponent as PauseIcon } from "../../../icons/pause-icon.svg";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import "./player-info-style.css";
import { useRecoilState } from "recoil";
import { PlayerState } from "../../../recoil/atoms/PlayerState";
import {
  defaultTheme,
  getThemeColor,
  setThemeColor,
  ThemeColorType,
} from "../../../utils/theme";
import {
  applyThemeFromImageUrl,
  getThemeSourceImageUrl,
} from "../../../utils/colors";
import { makeDebounced } from "../../../utils/common";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import giphys from "../../../constants/giphys";
import { trackEvent } from "../../../utils/ga";
import { MessageSquare } from "lucide-react";
import { FEEDBACK_FORM_URL } from "../../common/FeedbackNotification";

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
    trackEvent("Theme Color Changed", { type, color });
    setThemeColor(type, color);
    setTheme((prev: any) => ({
      ...prev,
      [type]: color,
    }));
    setPlayerData((prev: any) => {
      window.localStorage.setItem("is_custom_theme", "true");
      if (prev.isCustomTheme) return prev;
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
    const url = urlInputRef.current?.value || "";
    trackEvent("Set Custom Background Url", { hasUrl: Boolean(url) });
    setPlayerData((prev) => ({
      ...prev,
      bgImgUrl: url,
    }));
    window.localStorage.setItem("bgImgUrl", url);
  };

  const handleHeaderClick = () =>
    window.open("https://www.producthunt.com/products/lofi-fm");

  const handleScalingChange = (e: any) => {
    const isChecked = e.target.checked;
    trackEvent("Toggle Scaling", { disabled: isChecked });
    setPlayerData((prev) => ({
      ...prev,
      scalingDisabled: isChecked,
    }));
    window.localStorage.setItem("scaling_disabled", JSON.stringify(isChecked));
  };

  const [showAppliedTooltip, setShowAppliedTooltip] = useState(false);
  const [isMatchingTheme, setIsMatchingTheme] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);

  const handleThemeReset = () => {
    trackEvent("Theme Reset");
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

  const handleMatchBackground = async () => {
    trackEvent("Match Background Clicked", {
      hasCustomBg: Boolean(playerData.bgImgUrl),
      activeSong: playerData.activeSong,
    });
    if (isMatchingTheme) return;
    const imageUrl = getThemeSourceImageUrl(
      playerData.bgImgUrl,
      playerData.activeSong,
      playerData.isPlaying
    );
    if (!imageUrl) {
      trackEvent("Match Background Failed", { reason: "no_image_source" });
      return;
    }

    setIsMatchingTheme(true);
    try {
      const colors = await applyThemeFromImageUrl(imageUrl);
      if (colors) {
        setTheme(colors);
        setPlayerData((prev) => ({
          ...prev,
          isCustomTheme: true,
        }));
        window.localStorage.setItem("is_custom_theme", "true");
        trackEvent("Match Background Applied", {
          primary: colors.primary,
          secondary: colors.secondary,
          source: playerData.bgImgUrl ? "custom_bg" : "song_thumbnail",
        });
        setShowAppliedTooltip(true);
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }
        tooltipTimeoutRef.current = setTimeout(() => {
          setShowAppliedTooltip(false);
        }, 2000);
      } else {
        trackEvent("Match Background Failed", { reason: "extraction_failed" });
      }
    } catch (err) {
      console.error("Failed to match background theme", err);
      trackEvent("Match Background Failed", { reason: "error" });
    } finally {
      setIsMatchingTheme(false);
    }
  };

  const handleThemeChange = (type: ThemeColorType) => (e: any) => {
    debouncedThemeChange(e.target.value, type, setTheme, setPlayerData);
  };

  const handleTabChange = (value: string) => {
    trackEvent("Switch Info Tab", { tab: value });
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
                trackEvent("Remove Background Url");
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
            <div
              key="synthwave-visualizer"
              className="bg-tile"
              title="Retro Synthwave Visualizer"
              onClick={() => {
                const bgUrl = "/synthwave-visualizer-bg.svg";
                trackEvent("Select Background Gif", { id: "synthwave-visualizer" });
                setPlayerData((prev) => ({
                  ...prev,
                  bgImgUrl: bgUrl,
                }));
                window.localStorage.setItem("bgImgUrl", bgUrl);
              }}
            >
              <img
                src="/synthwave-visualizer-bg.svg"
                alt="Retro Synthwave Visualizer"
              />
              {playerData.bgImgUrl === "/synthwave-visualizer-bg.svg" && (
                <div className="selected-overlay">✓</div>
              )}
            </div>
            {giphys.map((giphy) => (
              <div
                key={giphy.id}
                className="bg-tile"
                onClick={() => {
                  const bgUrl = `/gifs/${giphy.id}`;
                  trackEvent("Select Background Gif", { id: giphy.id });
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
          <div className="settings theme-settings">
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
                <button onClick={handleThemeReset} className="btn reset-btn">
                  Reset
                </button>
              </section>
              <div className="section-divider vertical" />
              <div className="tooltip-wrapper">
                <button
                  type="button"
                  onClick={handleMatchBackground}
                  className="btn match-bg-btn"
                  title="Extract dominant colors from the current background"
                  disabled={isMatchingTheme}
                >
                  Match background
                </button>
                {showAppliedTooltip && (
                  <div className="match-tooltip">Applied</div>
                )}
              </div>
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
                      trackEvent("Timer Focus Time Changed", { focusMinutes: val });
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
                      trackEvent("Timer Break Time Changed", { breakMinutes: val });
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
                    setPlayerData((prev) => {
                      const nextIsRunning = !prev.isTimerRunning;
                      let nextSeconds = prev.timerSecondsRemaining;
                      if (prev.timerSecondsRemaining === 0) {
                        nextSeconds = (prev.timerMode === "work" ? prev.timerWorkTime : prev.timerBreakTime) * 60;
                      }
                      trackEvent(nextIsRunning ? "Timer Started" : "Timer Paused", {
                        mode: prev.timerMode,
                        remainingSeconds: nextSeconds,
                        focusMinutes: prev.timerWorkTime,
                        breakMinutes: prev.timerBreakTime,
                        source: "info_panel",
                      });
                      return {
                        ...prev,
                        isTimerRunning: nextIsRunning,
                        timerSecondsRemaining: nextSeconds,
                      };
                    });
                  }}
                  className="btn"
                >
                  {playerData.isTimerRunning ? <PauseIcon /> : <PlayIcon />}
                  <span>{playerData.isTimerRunning ? "Pause" : "Start"}</span>
                </button>
                <button
                  onClick={() => {
                    trackEvent("Timer Reset", {
                      mode: playerData.timerMode,
                      focusMinutes: playerData.timerWorkTime,
                      breakMinutes: playerData.timerBreakTime,
                      source: "info_panel",
                    });
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
            <button
              onClick={() => {
                trackEvent("Feedback Form Clicked", {
                  formUrl: FEEDBACK_FORM_URL,
                  source: "info_support_tab",
                });
                window.open(FEEDBACK_FORM_URL, "_blank", "noopener,noreferrer");
              }}
              className="btn feedback-btn"
            >
              <MessageSquare size={16} />
              <span>Feedback</span>
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PlayerInfo;
