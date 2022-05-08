import React from "react";

export type SongsProps = {
  songs: any[];
  onSongClick(songid: string): void;
  activeSongId?: string;
};

function Songs({ songs, onSongClick, activeSongId }: SongsProps) {
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
        </div>
      ))}
    </div>
  );
}

export default Songs;
