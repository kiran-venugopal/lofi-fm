import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Player from "./components/player/Player";
import AllSongs from "./components/AllSongs";

declare global {
  interface Window {
    YT: any;
    player: any;
  }
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>();
  const [isPlayed, setIsPlayed] = useState(false);

  function onPlayerStateChange(event: any) {
    console.log(event.data);
  }

  const handleLoadCapture = () => {
    const player = new window.YT.Player("yt-iframe", {
      events: {
        onStateChange: onPlayerStateChange,
      },
      playerVars: { autoplay: 1, controls: 0 },
    });

    window.player = player;
    setPlayer(player);
  };

  return (
    <div className="App" unselectable="on">
      <div className="iframe-container" unselectable="on">
        <iframe
          src="https://www.youtube.com/embed/5qap5aO4i9A?enablejsapi=1"
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
      <div className="player-content">
        {!isPlayed && <AllSongs />}

        {player && (
          <Player
            isPlaying={isPlaying}
            player={player}
            onPlayPauseClick={() =>
              setIsPlaying((prev) => {
                if (player) {
                  if (!prev) {
                    player?.playVideo();
                    if (!isPlayed) setIsPlayed(true);
                  } else player?.pauseVideo();
                  return !prev;
                }

                return prev;
              })
            }
          />
        )}
      </div>
      {!isPlaying && <div className="not-playing-overlay"></div>}
    </div>
  );
}

export default App;
