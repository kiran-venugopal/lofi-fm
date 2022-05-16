import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./index.css";

import Tracker from "@openreplay/tracker";

const tracker = new Tracker({
  projectKey: import.meta.env.VITE_YT_LOGS_KEY,
});

tracker.start();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);
