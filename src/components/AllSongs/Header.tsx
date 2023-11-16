import { ReactComponent as CloseIcon } from "../../icons/close-icon.svg";

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
          Starred
        </button>
        <button
          onClick={() => setActiveOption("allsongs")}
          className={`btn ${activeOption === "allsongs" ? "active" : ""}`}
        >
          All Songs
        </button>
        <button
          onClick={() => setActiveOption("addsong")}
          className={`btn ${activeOption === "addsong" ? "active" : ""}`}
        >
          Add Songs
        </button>
      </div>
      <div className="close">
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

export default Header;
