const { app, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
  const preloadPath = path.join(app.getAppPath(), "preload.js");
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "..", "dist", "index.html"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
