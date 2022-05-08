import { useEffect, useState } from "react";
import songs from "../../songs.json";
import axios from "axios";
import "./all-songs-style.css";
import { ReactComponent as CloseIcon } from "../../icons/close-icon.svg";
import Songs from "./Songs";

export type AllSongsProps = {
  onSongClick(songId: string): void;
  activeSongId?: string;
  onClose?(): void;
};

function AllSongs({ onSongClick, activeSongId, onClose }: AllSongsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState<any[]>([]);
  const [activeOption, setActiveOpion] = useState<
    "songs" | "starred" | "addsong"
  >("songs");
  const [url, setUrl] = useState("");
  const [starred, setStarred] = useState(
    JSON.parse(localStorage.getItem("starred") || "[]")
  );

  const getSongsData = async (id: string) => {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&key=${
        import.meta.env.VITE_YT_KEY
      }&id=${id}`
    );
    return response.data.items.map((item: any) => ({
      ...item.snippet,
      id: item.id,
    }));
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const songsArr = await getSongsData(songs.join(","));
      setAllSongs(songsArr);
      setIsLoading(false);
    };
    fetchSongs();
  }, []);

  const handleAddClick = async () => {
    try {
      const urlObj = new URL(url);
      let id = urlObj.searchParams.get("v");
      if (!id) {
        id = urlObj.pathname?.substring(1);
      }

      const res = (await getSongsData(id)) as any[];
      setAllSongs((prev: any) => [...prev, ...res]);
    } catch {
      alert("invalid url");
    }
  };

  if (isLoading) {
    return (
      <div className="all-songs-container">
        <div className="header">
          <div className="options">
            <button
              className={`${activeOption === "starred" ? "active" : ""}`}
              onClick={() => setActiveOpion("starred")}
            >
              Starred
            </button>
            <button
              onClick={() => setActiveOpion("songs")}
              className={`${activeOption === "songs" ? "active" : ""}`}
            >
              Songs
            </button>
            <button
              className={`${activeOption === "addsong" ? "active" : ""}`}
              onClick={() => setActiveOpion("addsong")}
            >
              Add Song
            </button>
          </div>
          <div className="close">
            <button onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div style={{ padding: "15px" }}>Loading..</div>
      </div>
    );
  }

  return (
    <div className="all-songs-container">
      <div className="header">
        <div className="options">
          <button
            className={`${activeOption === "starred" ? "active" : ""}`}
            onClick={() => setActiveOpion("starred")}
          >
            Starred
          </button>
          <button
            onClick={() => setActiveOpion("songs")}
            className={`${activeOption === "songs" ? "active" : ""}`}
          >
            All Songs
          </button>
          <button
            className={`${activeOption === "addsong" ? "active" : ""}`}
            onClick={() => setActiveOpion("addsong")}
          >
            Add Song
          </button>
        </div>
        <div className="close">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>
      {activeOption === "addsong" && (
        <div className="add-song">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="paste youtube url here.."
          />
          <button onClick={handleAddClick}>Add</button>
        </div>
      )}
      {activeOption === "songs" && (
        <Songs
          songs={allSongs}
          onSongClick={onSongClick}
          activeSongId={activeSongId}
          starred={starred}
          addOrRemoveStar={(id: string, isAdding: boolean) =>
            setStarred((prev: string[]) => {
              let newState;
              if (isAdding) {
                newState = [...prev, id];
              } else {
                newState = [...prev.filter((sid: string) => sid !== id)];
              }
              window.localStorage.setItem("starred", JSON.stringify(newState));
              return newState;
            })
          }
        />
      )}
      {activeOption === "starred" && (
        <Songs
          songs={allSongs.filter((song: any) => starred.includes(song.id))}
          onSongClick={onSongClick}
          activeSongId={activeSongId}
          starred={starred}
          addOrRemoveStar={(id: string, isAdding: boolean) =>
            setStarred((prev: string[]) => {
              let newState;
              if (isAdding) {
                newState = [...prev, id];
              } else {
                newState = [...prev.filter((sid: string) => sid !== id)];
              }
              window.localStorage.setItem("starred", JSON.stringify(newState));
              return newState;
            })
          }
        />
      )}
    </div>
  );
}

export default AllSongs;
