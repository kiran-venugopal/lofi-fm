// preload.js

const { contextBridge, ipcRenderer } = require("electron");

// Expose các API từ Electron cho Renderer Process
contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});
