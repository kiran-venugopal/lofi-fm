import { ReactComponent as YoutubeIcon } from "../../../icons/youtube-icon.svg";
import { ReactComponent as GithubIcon } from "../../../icons/github-icon.svg";
import { ReactComponent as BMFIcon } from "../../../icons/bmf-icon.svg";
import { ReactComponent as EcashIcon } from "../../../icons/ecash-icon.svg";
import { ReactComponent as Logo } from "../../../icons/lofifm.svg";
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

export type PlayerInfoProps = {
  infoRef: MutableRefObject<any>;
  player: any;
  onEcashClick(): void;
};
const debouncedThemeChange = makeDebounced(
  (color: string, type: ThemeColorType, setTheme: React.Dispatch<any>) => {
    setThemeColor(type, color);
    setTheme((prev: any) => ({
      ...prev,
      [type]: color,
    }));
  },
  100
);

function PlayerInfo({ infoRef, player, onEcashClick }: PlayerInfoProps) {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [theme, setTheme] = useState({
    primary: getThemeColor("primary"),
    secondary: getThemeColor("secondary"),
  });
  const urlInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleThemeChange = (type: ThemeColorType) => (e: any) => {
    debouncedThemeChange(e.target.value, type, setTheme);
  };

  return (
    <div className="player-info" ref={infoRef}>
      <div onClick={handleHeaderClick} className="header">
        <div className="logo">
          <Logo />
        </div>
        <div className="app-name">LoFi Fm</div>
      </div>

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
      </div>
      <div className="resources">
        <button
          onClick={() => window.open(player?.playerInfo?.videoUrl)}
          className="btn"
        >
          <YoutubeIcon />
          <span>Play in Youtube</span>
        </button>
        <button
          onClick={() => window.open("https://github.com/coldowl")}
          className="btn gh"
        >
          <GithubIcon />
          <span>Find me in Github</span>
        </button>
        {/* <button
          onClick={() => window.open("https://www.buymeacoffee.com/kiranv")}
          className="btn bmf"
        >
          <BMFIcon />
          <span>Buy me Coffee</span>
        </button>
        <button onClick={onEcashClick} className="btn cashtab">
          <EcashIcon />
          <span>eCash</span>
        </button> */}
      </div>
    </div>
  );
}

export default PlayerInfo;
