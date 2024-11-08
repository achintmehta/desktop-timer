const { app, Menu, BrowserWindow } = require("electron");
const path = require("path");

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    // width: 300,
    // height: 400,
    transparent: true,
    frame: false,
    webPreferences: {
        webSecurity: true,
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true
    },
    icon: path.join(__dirname, '../public/favicon.png')});
  mainWindow.loadFile(path.join(__dirname, "public/index.html"));
  mainWindow.setMenuBarVisibility(false);
  mainWindow.setBackgroundColor("#00ffffff");
  Menu.setApplicationMenu(null);
  mainWindow.webContents.openDevTools();
});