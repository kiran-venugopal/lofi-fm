import { useEffect, useState } from "react";
import songs from "../../songs.json";
import axios from "axios";
import "./all-songs-style.css";

export type AllSongsProps = {
  onSongClick(songId: string): void;
  activeSongId?: string;
};

function AllSongs({ onSongClick, activeSongId }: AllSongsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [allSongs, setAllSongs] = useState([]);

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
    return <div>Loading..</div>;
  }

  return (
    <div className="all-songs">
      {allSongs.map((song: any) => (
        <div
          onClick={() => onSongClick(song.id)}
          className={`song-item ${activeSongId === song.id ? "active" : ""}`}
          key={song.id}
        >
          <img src={song.thumbnails.default.url} />
          <div className="info">
            <div className="title">{song.title}</div>
            <div className="channel">{song.channelTitle}</div>
            {song.liveBroadcastContent === "live" && (
              <div className="live-tag">Live</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AllSongs;
