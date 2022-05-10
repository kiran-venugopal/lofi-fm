import { useState } from "react";
import "./App.css";
import Player from "./components/player/Player";
import AllSongs from "./components/AllSongs";
import { useRecoilState } from "recoil";
import { PlayerState } from "./recoil/atoms/PlayerState";

declare global {
  interface Window {
    YT: any;
    player: any;
  }
}

function App() {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [player, setPlayer] = useState();

  function onPlayerStateChange(event: any) {
    if (event.data === 1) {
      setPlayerData((prev) => ({
        ...prev,
        isPlaying: true,
      }));
    }
  }

  const handleLoadCapture = () => {
    new window.YT.Player("yt-iframe", {
      events: {
        onStateChange: onPlayerStateChange,
        onReady: function (event: any) {
          event.target.playVideo();
          setPlayer(event.target);
          console.log(event.target.playerInfo);
        },
      },
      playerVars: { autoplay: 1, controls: 0 },
    });
  };

  return (
    <div className="App" unselectable="on">
      <div className="iframe-container" unselectable="on">
        <iframe
          key={playerData.activeSong}
          src={`https://www.youtube.com/embed/${playerData.activeSong}?enablejsapi=1`}
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
        {playerData.showSongsList && (
          <AllSongs
            onSongClick={(songId) =>
              setPlayerData((prev) => ({
                ...prev,
                activeSong: songId,
              }))
            }
            activeSongId={playerData.activeSong}
            onClose={() =>
              setPlayerData((prev) => ({
                ...prev,
                showSongsList: false,
              }))
            }
          />
        )}

        {player && <Player player={player} />}
      </div>
      {!playerData.isPlaying && <div className="not-playing-overlay"></div>}
    </div>
  );
}

export default App;
