import { useEffect, useState } from "react";
import axios from "axios";
import "./all-songs-style.css";
import { ReactComponent as CloseIcon } from "../../icons/close-icon.svg";
import Songs from "./Songs";
import { useRecoilState, useSetRecoilState } from "recoil";
import { SongsState } from "../../recoil/atoms/SongsState";
import { defaultSongs } from "../../constants/songs";
import { PlayerState } from "../../recoil/atoms/PlayerState";
import { getAddedSongs, getAllSongs } from "../../utils/songs";
import Header from "./Header";

export type AllSongsProps = {
  onSongClick(songId: string): void;
  activeSongId?: string;
  onClose(): void;
};

function AllSongs({ onSongClick, activeSongId, onClose }: AllSongsProps) {
  const [songsData, setSongsData] = useRecoilState(SongsState);
  const [activeOption, setActiveOption] = useState<
    "allsongs" | "starred" | "addsong"
  >("allsongs");
  const [url, setUrl] = useState("");

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

  const getSpotifyData = async (url: string) => {
    const response = await axios.get(
      `https://open.spotify.com/oembed?url=${url}`
    );
    const data = response.data;
    return [
      {
        title: data.title,
        channelTitle: data.provider_name,
        author: data.provider_name,
        id: url,
        iframeUrl: data.iframe_url,
        url,
        thumbnails: {
          default: {
            url: data.thumbnail_url,
          },
        },
      },
    ];
  };

  const handleAddorRemoveStar = (songId: string, isAdding: boolean) => {
    let newStarred: string[] = [];
    setSongsData((prev) => {
      if (isAdding) {
        newStarred = [...prev.starredIds, songId];
      } else {
        newStarred = prev.starredIds.filter((sid: string) => sid !== songId);
      }
      return { ...prev, starredIds: newStarred };
    });
    window.localStorage.setItem("starred", JSON.stringify(newStarred));
  };

  const handleAddClick = async () => {
    try {
      const urlObj = new URL(url);
      let id = urlObj.searchParams.get("v");

      const isSpotify = url.includes("open.spotify.com");
      if (isSpotify) {
        id = url;
      }

      if (!id) {
        id = urlObj.pathname?.substring(1);
      }

      const existingAddedSongs = getAddedSongs();

      if (
        songsData.songs.map(({ id }) => id).includes(id) ||
        existingAddedSongs.includes(id)
      ) {
        alert("This song already added! Try with a different YouTube url");
        return;
      }

      let res;

      if (isSpotify) {
        res = (await getSpotifyData(id)) as any;
      } else {
        res = (await getSongsData(id)) as any[];
      }

      setSongsData((prev: any) => ({
        ...prev,
        songs: [...res, ...prev.songs],
      }));

      window.localStorage.setItem(
        "addedSongs",
        JSON.stringify([id, ...existingAddedSongs])
      );
      setActiveOption("allsongs");
    } catch {
      alert("Invalid YouTube url! Try with a different url");
    }
  };

  const handleRemove = (songId: string) => {
    setSongsData((prev) => ({
      ...prev,
      songs: [...prev.songs.filter((song: any) => song.id !== songId)],
    }));
    let addedSongs = getAddedSongs();
    window.localStorage.setItem(
      "addedSongs",
      JSON.stringify(addedSongs.filter((song: string) => song !== songId))
    );
  };

  if (songsData.isLoading) {
    return (
      <div className="all-songs-container" onClick={(e) => e.stopPropagation()}>
        <Header
          setActiveOption={setActiveOption}
          activeOption={activeOption}
          onClose={onClose}
        />
        <div style={{ padding: "15px" }}>Loading..</div>
      </div>
    );
  }

  return (
    <div className="all-songs-container" onClick={(e) => e.stopPropagation()}>
      <Header
        setActiveOption={setActiveOption}
        activeOption={activeOption}
        onClose={onClose}
      />
      {activeOption === "allsongs" && (
        <Songs
          songs={songsData.songs}
          onSongClick={onSongClick}
          activeSongId={activeSongId}
          addOrRemoveStar={handleAddorRemoveStar}
          starred={songsData.starredIds}
          onRemoveSong={handleRemove}
        />
      )}

      {activeOption === "starred" && (
        <Songs
          songs={songsData.songs.filter((song: any) =>
            songsData.starredIds.includes(song.id)
          )}
          onSongClick={onSongClick}
          activeSongId={activeSongId}
          addOrRemoveStar={handleAddorRemoveStar}
          starred={songsData.starredIds}
          onRemoveSong={handleRemove}
        />
      )}

      {activeOption === "addsong" && (
        <div className="add-song">
          <input
            type="text"
            value={url}
            autoFocus={true}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="paste youtube url here.."
          />
          <button onClick={handleAddClick}>Add</button>
        </div>
      )}
    </div>
  );
}

export default AllSongs;
