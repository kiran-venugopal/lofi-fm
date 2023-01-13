import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

import Tracker from "@openreplay/tracker";
import { registerSW } from "virtual:pwa-register";
import Toast, { addToast } from "react-toast-package";
import UpdateApp from "./components/UpdateApp";
import { getCursorImage, initTheme, updateCursor } from "./utils/theme";

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location)) {
  const updateSW = registerSW({
    onNeedRefresh() {
      setTimeout(() => {
        addToast(() => <UpdateApp onClick={() => updateSW(true)} />);
      }, 100);
    },
  });
}

const tracker = new Tracker({
  projectKey: import.meta.env.VITE_YT_LOGS_KEY,
});

tracker.start();
initTheme();

window.onload = () => updateCursor();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <Toast timeOutDuration={5000} position="top-right" />
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
