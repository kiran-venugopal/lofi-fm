import { Star, Music, Plus, X } from "lucide-react";

export type HeaderOptionType = "starred" | "allsongs" | "addsong";

export type HeaderProps = {
  setActiveOption(option: HeaderOptionType): void;
  activeOption: HeaderOptionType;
  onClose(): void;
};

function Header({ setActiveOption, activeOption, onClose }: HeaderProps) {
  return (
    <div className="header">
      <div className="options">
        <button
          onClick={() => setActiveOption("starred")}
          className={`btn ${activeOption === "starred" ? "active" : ""}`}
        >
          <Star size={14} />
          Starred
        </button>
        <button
          onClick={() => setActiveOption("allsongs")}
          className={`btn ${activeOption === "allsongs" ? "active" : ""}`}
        >
          <Music size={14} />
          All Songs
        </button>
        <button
          onClick={() => setActiveOption("addsong")}
          className={`btn ${activeOption === "addsong" ? "active" : ""}`}
        >
          <Plus size={14} />
          Add Song
        </button>
      </div>
      <div className="close">
        <button onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

export default Header;

