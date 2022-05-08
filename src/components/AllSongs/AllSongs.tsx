import { useEffect, useState } from "react";
import songs from "../../songs.json";
import axios from "axios";
import "./all-songs-style.css";
import { ReactComponent as CloseIcon } from "../../icons/close-icon.svg";
import Songs from "./Songs";
import SearchSongs from "./SearchSongs";

export type AllSongsProps = {
  onSongClick(songId: string): void;
  activeSongId?: string;
  onClose?(): void;
};

function AllSongs({ onSongClick, activeSongId, onClose }: AllSongsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState([]);
  const [activeOption, setActiveOpion] = useState<
    "allsongs" | "starred" | "search"
  >("allsongs");

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&key=${
          import.meta.env.VITE_YT_KEY
        }&id=${songs.join(",")}`
      );
      setAllSongs(
        response.data.items.map((item: any) => ({
          ...item.snippet,
          id: item.id,
        }))
      );
      setIsLoading(false);
    };
    fetchSongs();
  }, []);

  if (isLoading) {
    return (
      <div className="all-songs-container">
        <div style={{ padding: "15px" }}>Loading..</div>
      </div>
    );
  }

  return (
    <div className="all-songs-container">
      <div className="header">
        <div className="options">
          {/* <button
            className={`${activeOption === "starred" ? "active" : ""}`}
            onClick={() => setActiveOpion("starred")}
          >
            Starred
          </button> */}
          <button
            onClick={() => setActiveOpion("allsongs")}
            className={`${activeOption === "allsongs" ? "active" : ""}`}
          >
            All Songs
          </button>
          <button
            className={`${activeOption === "search" ? "active" : ""}`}
            onClick={() => setActiveOpion("search")}
          >
            Search
          </button>
        </div>
        <div className="close">
          <button onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>
      {activeOption === "allsongs" && (
        <Songs
          songs={allSongs}
          onSongClick={onSongClick}
          activeSongId={activeSongId}
        />
      )}
      {activeOption === "search" && (
        <SearchSongs query="" setActiveSong={onSongClick} />
      )}
    </div>
  );
}

export default AllSongs;
