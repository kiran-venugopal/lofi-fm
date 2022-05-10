import { ReactComponent as StarIcon } from "../../../icons/star-icon.svg";
import { ReactComponent as StarFilledIcon } from "../../../icons/star-icon-filled.svg";

export type SongsProps = {
  songs: any[];
  onSongClick(songid: string): void;
  activeSongId?: string;
  starred: string[];
  addOrRemoveStar(songId: string, isAdding: boolean): void;
};

function Songs({
  songs,
  onSongClick,
  activeSongId,
  addOrRemoveStar,
  starred = [],
}: SongsProps) {
  return (
    <div className="all-songs">
      {songs.map((song: any) => (
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
      ))}
    </div>
  );
}

export default Songs;
