import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import Player from "./components/player/Player";
import AllSongs from "./components/AllSongs";
import songs from "./songs.json";

declare global {
  interface Window {
    YT: any;
    player: any;
  }
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>();
  const [showAllSongs, setShowAllSongs] = useState(true);
  const [activeSong, setActiveSong] = useState(songs[0]);

  function onPlayerStateChange(event: any) {
    console.log(event.data);
    if (event.data === 1) {
      setIsPlaying(true);
    }
  }

  const handleLoadCapture = () => {
    const player = new window.YT.Player("yt-iframe", {
      events: {
        onStateChange: onPlayerStateChange,
        onReady: function (event: any) {
          event.target.playVideo();
          setPlayer(event.target);
        },
      },
      playerVars: { autoplay: 1, controls: 0 },
    });
  };

  return (
    <div className="App" unselectable="on">
      <div className="iframe-container" unselectable="on">
        <iframe
          key={activeSong}
          src={`https://www.youtube.com/embed/${activeSong}?enablejsapi=1`}
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
        {showAllSongs && (
          <AllSongs
            onSongClick={setActiveSong}
            activeSongId={activeSong}
            onClose={() => setShowAllSongs(false)}
          />
        )}

        {player && (
          <Player
            isPlaying={isPlaying}
            player={player}
            onPlayListClick={() => setShowAllSongs((prev) => !prev)}
            onPlayPauseClick={() =>
              setIsPlaying((prev) => {
                if (player) {
                  if (!prev) {
                    player?.playVideo();
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
