import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import giphys from "../../constants/giphys";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import { generateRandomIndex } from "../../utils/songs";
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
      const randomIndex = generateRandomIndex(giphys.length);
      backgroundUrl = `/gifs/${giphys[randomIndex].id}`;
    }
    setGif({ url: backgroundUrl, credit: creditGif });
  }, [playerData.bgImgUrl]);

  if (!playerData.isPlaying || playerData.isBuffering || showAlways) {
    return (
      <Fragment>
        <div
          className="overlay"
          style={{
            backgroundImage: `linear-gradient(#0000009e,#0000009e),url(${gif.url})`,
          }}
        ></div>
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
