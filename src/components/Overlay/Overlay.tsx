import { useEffect, useState } from "react";
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
      <div className="overlay">
        <div className="text">
          {!playerData.isPlaying && player
            ? "Tap to start playing the Lofi FM 📻"
            : "Buffering.. ⏳"}
        </div>
        <div className="credits">
          <div className="product-hunt"></div>
          <div className="giphy"></div>
        </div>
        <img src={`/gifs/${gif.id}.gif`} />
      </div>
    );
  }

  return null;
}

export default Overlay;
