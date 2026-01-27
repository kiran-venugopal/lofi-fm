import { useEffect, useState } from "react";
import "./App.css";
import Player from "./components/player/Player";
import { extractColorsFromImage } from "./utils/colors";
import AllSongs from "./components/AllSongs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { PlayerState } from "./recoil/atoms/PlayerState";
import { generateRandomIndex } from "./utils/songs";
import { ISongsState, SongsState } from "./recoil/atoms/SongsState";
import { defaultSongs } from "./constants/songs";
import Overlay from "./components/Overlay";

declare global {
  interface Window {
    YT: any;
    player: any;
  }
}

function App() {
  const [playerData, setPlayerData] = useRecoilState(PlayerState);
  const [player, setPlayer] = useState<any>();
  const [songState, setSongsData] = useRecoilState(SongsState);
  const isSpotify = playerData.activeSong?.includes("open.spotify.com");
  const songItem = songState.songs?.find(
    (song) => song.id === playerData.activeSong
  );

  function onPlayerStateChange(event: any) {
    let songsData: ISongsState;
    setSongsData((prev) => {
      songsData = prev;
      return prev;
    });

    setPlayerData((prev) => {
      switch (event.data) {
        case 0:
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
            return {
              ...prev,
              activeSong: songsData.songs[index].id || defaultSongs[0],
              isBuffering: false,
            };
          }
          return {
            ...prev,
            isBuffering: false,
          };

        case 1:
          return {
            ...prev,
            isPlaying: true,
            isBuffering: false,
          };

        case 2:
          return {
            ...prev,
            isPlaying: false,
            isBuffering: false,
          };

        case 3:
        case -1:
          return {
            ...prev,
            isBuffering: true,
          };

        default:
          return {
            ...prev,
            isBuffering: false,
          };
      }
    });
  }

  useEffect(() => {
    const updateColors = async () => {
      let imageUrl = playerData.bgImgUrl;

      if (!imageUrl && playerData.activeSong) {
        // Fallback to YouTube thumbnail
        imageUrl = `https://img.youtube.com/vi/${playerData.activeSong}/maxresdefault.jpg`;
      }

      if (imageUrl) {
        try {
          const colors = await extractColorsFromImage(imageUrl);
          if (colors && colors.length >= 2) {
            const [primary, secondary] = colors;
            document.body.style.setProperty(
              "--primary_color",
              `rgb(${primary[0]}, ${primary[1]}, ${primary[2]})`
            );
            document.body.style.setProperty(
              "--secondary_color",
              `rgb(${secondary[0]}, ${secondary[1]}, ${secondary[2]})`
            );
          }
        } catch (e) {
          // Fallback to hqdefault if maxresdefault fails (common for some videos)
          if (imageUrl.includes("maxresdefault")) {
            const hqUrl = imageUrl.replace("maxresdefault", "hqdefault");
            try {
              const colors = await extractColorsFromImage(hqUrl);
              if (colors && colors.length >= 2) {
                const [primary, secondary] = colors;
                document.body.style.setProperty(
                  "--primary_color",
                  `rgb(${primary[0]}, ${primary[1]}, ${primary[2]})`
                );
                document.body.style.setProperty(
                  "--secondary_color",
                  `rgb(${secondary[0]}, ${secondary[1]}, ${secondary[2]})`
                );
              }
            } catch (e2) {
              console.error("Failed to extract colors from fallback thumbnail", e2);
            }
          } else {
            console.error("Failed to extract colors", e);
          }
        }
      }
    };

    updateColors();
  }, [playerData.bgImgUrl, playerData.activeSong]);

  const handleLoadCapture = () => {
    new window.YT.Player("yt-iframe", {
      events: {
        onStateChange: onPlayerStateChange,
        onReady: function (event: any) {
          const data = {
            playerInfo: {
              videoData: event.target.getVideoData(),
              videoUrl: event.target.getVideoUrl(),
            },
            playVideo() {
              event.target.playVideo();
            },
            pauseVideo() {
              event.target.pauseVideo();
            },
            setVolume(...args: any) {
              event.target.setVolume(...args);
            },
            seekTo(...args: any) {
              event.target.seekTo(...args);
            },
            getCurrentTime() {
              return event.target.getCurrentTime();
            },
            getDuration() {
              return event.target.getDuration();
            },
          };
          event.target.playVideo();
          setPlayer(data);
        },
      },
      playerVars: { autoplay: 1, controls: 0 },
    });
  };

  return (
    <div className="App" unselectable="on">
      <div className="iframe-container" unselectable="on">
        {!isSpotify && (
          <iframe
            key={playerData.activeSong}
            className="yt-iframe"
            src={`https://www.youtube.com/embed/${playerData.activeSong}?enablejsapi=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            id="yt-iframe"
            unselectable="on"
            onSelect={() => false}
            onMouseDown={() => false}
            onLoad={handleLoadCapture}
            style={
              playerData.scalingDisabled
                ? {
                  transform: "scale(1)",
                }
                : {}
            }
          />
        )}
      </div>

      <div
        style={{
          backgroundImage: `url(${playerData.bgImgUrl})`,
          backgroundColor: playerData.bgImgUrl && "black",
        }}
        className="player-content"
      >
        {playerData.showSongsList && (
          <AllSongs
            onSongClick={(songId) => {
              setPlayerData((prev) => ({
                ...prev,
                activeSong: songId,
              }));
              window.localStorage.setItem("activeSong", songId);
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

        <div className="text">
          {!playerData.isPlaying &&
            player &&
            "Tap to start playing the Lofi FM 📻"}
          {playerData.isPlaying && playerData.isBuffering && "Buffering.. ⏳"}
        </div>

        <Player player={player} />
      </div>

      <Overlay showAlways={isSpotify} player={player} />
    </div>
  );
}

export default App;
