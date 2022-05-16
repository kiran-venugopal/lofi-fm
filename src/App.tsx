import { useState } from "react";
import "./App.css";
import Player from "./components/player/Player";
import AllSongs from "./components/AllSongs";
import { useRecoilState } from "recoil";
import { PlayerState } from "./recoil/atoms/PlayerState";
import { generateRandomIndex } from "./utils/songs";
import { SongsState } from "./recoil/atoms/SongsState";
import { defaultSongs } from "./constants/songs";

declare global {
  interface Window {
    YT: any;
    player: any;
  }
}

function App() {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [player, setPlayer] = useState();
  const [songsData] = useRecoilState(SongsState) as any;

  function onPlayerStateChange(event: any) {
    if (event.data === 1) {
      setPlayerData((prev) => ({
        ...prev,
        isPlaying: true,
      }));
    }
    if (event.data === 0) {
      if (songsData.songs.length > 1) {
        let index = generateRandomIndex(songsData.songs.length - 1);
        let song = songsData.songs[index];
        const activeSongIndex = songsData.songs.findIndex(
          (song: any) => song.id === playerData.activeSong
        );
        while (index === activeSongIndex) {
          index = generateRandomIndex(songsData.songs.length - 1);
          song = songsData.songs[index];
        }
        setPlayerData((prev) => ({
          ...prev,
          activeSong: songsData.songs[index].id || defaultSongs[0],
        }));
      }
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
            onSongClick={(songId) => {
              setPlayerData((prev) => ({
                ...prev,
                activeSong: songId,
              }));
              window.localStorage.setItem("activeSong", songId)
            }}
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
