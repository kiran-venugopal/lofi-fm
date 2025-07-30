import { ReactComponent as StarIcon } from "../../../icons/star-icon.svg";
import { ReactComponent as StarFilledIcon } from "../../../icons/star-icon-filled.svg";
import { ReactComponent as DeleteIcon } from "../../../icons/delete-icon.svg";
import { defaultSongs } from "../../../constants/songs";
import { flushSync } from "react-dom";

export type SongsProps = {
  songs: any[];
  onSongClick(songid: string): void;
  activeSongId?: string;
  starred: string[];
  addOrRemoveStar(songId: string, isAdding: boolean): void;
  onRemoveSong(songId: string): void;
};

function Songs({
  songs,
  onSongClick,
  activeSongId,
  addOrRemoveStar,
  starred = [],
  onRemoveSong,
}: SongsProps) {
  return (
    <div className="all-songs">
      {songs.map((song: any) => (
        <div
          onClick={() => onSongClick(song.id)}
          className={`song-item ${activeSongId === song.id ? "active" : ""}`}
          key={song.id}
        >
          <img className="thumbnail" src={song.thumbnails.default.url} />
          <div className="info">
            <div className="title">{song.title}</div>
            <div className="channel">{song.channelTitle}</div>
            {song.liveBroadcastContent === "live" && (
              <div className="live-tag">Live</div>
            )}
          </div>
          <div className="options">
            {!defaultSongs.includes(song.id) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSong(song.id);
                }}
                className="star-button"
              >
                <DeleteIcon />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addOrRemoveStar(song.id, !starred.includes(song.id));
              }}
              className="star-button"
            >
              {starred.includes(song.id) ? <StarFilledIcon /> : <StarIcon />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Songs;
