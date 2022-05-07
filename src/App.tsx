import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

declare global {
  interface Window {
    YT: any;
    player: any;
  }
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  function onPlayerStateChange(event: any) {
    console.log(event.data);
  }

  const handleLoadCapture = () => {
    const player = new window.YT.Player("yt-iframe", {
      events: {
        onStateChange: onPlayerStateChange,
      },
    });

    window.player = player;
    window.addEventListener("click", () => {
      setIsPlaying((prev) => {
        if (prev) {
          player.pauseVideo();
        } else player.playVideo();
        return !prev;
      });
    });
  };

  return (
    <div className="App" unselectable="on">
      <div className="iframe-container" unselectable="on">
        <iframe
          src="https://www.youtube.com/embed/eb22rcq5ybI?enablejsapi=1"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          id="yt-iframe"
          unselectable="on"
          onSelect={() => false}
          onMouseDown={() => false}
          onLoadCapture={handleLoadCapture}
        />
      </div>
      {!isPlaying && <div className="not-paying">Tap anywhere to play </div>}
    </div>
  );
}

export default App;
