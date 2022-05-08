import axios from "axios";
import React, { useEffect, useState } from "react";
import Songs from "../Songs";

export type SearchSongsProps = {
  query: string;
  setActiveSong(songid: string): void;
  activeSongId?: string;
};

function SearchSongs({ query, setActiveSong, activeSongId }: SearchSongsProps) {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      const response = await axios.get(
        `https://youtube.googleapis.com/youtube/v3/search?part=snippet&key=${
          import.meta.env.VITE_YT_KEY
        }&q=${query || "lofi songs "}&maxResults=10`
      );
      setSongs(
        response.data.items.map((item: any) => ({
          ...item.snippet,
          id: item.id.videoId,
        }))
      );
    };
    fetchSongs();
  }, [query]);

  return (
    <Songs
      songs={songs}
      onSongClick={setActiveSong}
      activeSongId={activeSongId}
    />
  );
}

export default SearchSongs;
