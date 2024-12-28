import { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import giphys from "../../constants/giphys";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import { generateRandomIndex } from "../../utils/songs";
import "./overlay-style.css";

export type OverlayProps = {
  player?: any;
};

function Overlay({ player }: OverlayProps) {
  const [playerData] = useRecoilState(PlayerState);
  const [gif, setGif] = useState<any>({});

  useEffect(() => {
    const randomIndex = generateRandomIndex(giphys.length);
    setGif(giphys[randomIndex]);
  }, []);

  if (!playerData.isPlaying || playerData.isBuffering) {
    return (
      <Fragment>
        <div
          className="overlay"
          style={{
            backgroundImage: `linear-gradient(#0000009e,#0000009e),url(/gifs/${gif.id}.gif)`,
          }}
        ></div>
      </Fragment>
    );
  }

  return null;
}

export default Overlay;
