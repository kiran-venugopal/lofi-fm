import "./update-app-style.css";
export type UpdateAppProps = {
  onClick(): void;
};

function UpdateApp({ onClick }: UpdateAppProps) {
  return (
    <div className="update-app">
      <h3>A new version of this app is Available!</h3>
      <button onClick={onClick}>Update</button>
    </div>
  );
}

export default UpdateApp;
