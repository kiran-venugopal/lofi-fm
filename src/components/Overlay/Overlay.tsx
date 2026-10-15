import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import giphys from "../../constants/giphys";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import SynthwaveBackground from "../common/SynthwaveBackground";
import "./overlay-style.css";

export type OverlayProps = {
  player?: any;
  showAlways?: boolean;
};

function Overlay({ player, showAlways }: OverlayProps) {
  const [playerData] = useRecoilState(PlayerState);
  const [gif, setGif] = useState<any>({});

  useEffect(() => {
    let backgroundUrl = playerData.bgImgUrl;
    let creditGif = null;
    if (playerData.bgImgUrl && playerData.bgImgUrl.startsWith("/gifs/")) {
      const id = playerData.bgImgUrl.replace("/gifs/", "");
      creditGif = giphys.find((g) => g.id === id);
    }
    if (!backgroundUrl) {
      backgroundUrl = "/synthwave-visualizer-bg.svg";
    }
    setGif({ url: backgroundUrl, credit: creditGif });
  }, [playerData.bgImgUrl]);

  const isExplicitSynthwave =
    playerData.bgImgUrl === "/synthwave-visualizer-bg.svg";
  const shouldShowOverlay =
    isExplicitSynthwave ||
    !playerData.isPlaying ||
    playerData.isBuffering ||
    showAlways;

  if (shouldShowOverlay) {
    const isSynthwave =
      isExplicitSynthwave || gif.url === "/synthwave-visualizer-bg.svg";

    return (
      <Fragment>
        <div
          className="overlay"
          style={
            isSynthwave
              ? { backgroundColor: "#06030c", overflow: "hidden" }
              : {
                  backgroundImage: `linear-gradient(#0000009e,#0000009e),url(${gif.url})`,
                }
          }
        >
          {isSynthwave && <SynthwaveBackground />}
        </div>
        {gif.credit && gif.credit.user && (
          <div className="credits">
            <div className="product-hunt"></div>
            <div className="giphy">
              Image Credits:{" "}
              <a target="_blank" href={gif.credit.user.profile_url}>
                {gif.credit.user.name}
              </a>
            </div>
          </div>
        )}
      </Fragment>
    );
  }

  return null;
}

export default Overlay;
