import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

import Toast from "react-toast-package";
import { initTheme, updateCursor } from "./utils/theme";
import initGA from "./utils/ga";

// const tracker = new Tracker({
//   projectKey: import.meta.env.VITE_YT_LOGS_KEY,
// });

// tracker.start();
initTheme();
initGA();

window.onload = () => updateCursor();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Toast timeOutDuration={5000} position="top-right" />
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
