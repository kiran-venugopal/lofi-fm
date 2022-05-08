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

  if (isLoading) {
    return (
      <div className="all-songs-container">
        <div style={{ padding: "15px" }}>Loading..</div>
      </div>
    );
  }

  return (
    <div className="all-songs-container">
      <Songs
        songs={allSongs}
        onSongClick={onSongClick}
        activeSongId={activeSongId}
      />
    </div>
  );
}

export default AllSongs;
