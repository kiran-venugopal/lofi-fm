import React from "react";

export type SearchSongsProps = {
  query: string;
  setActiveSong(songid: string): void;
};

function SearchSongs({ query, setActiveSong }: SearchSongsProps) {
  return <div>SearchSongs</div>;
}

export default SearchSongs;
