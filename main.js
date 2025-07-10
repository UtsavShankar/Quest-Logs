const { create } = require('domain');
const { app,Tray,Menu, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;
let tray = null;
let win = null;
function createTray() {
  if (!tray){
  const icon = nativeImage.createFromPath('' + path.join(__dirname, 'public/favicon.ico'));
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        console.log('Show App clicked');
        if(!win){
          createWindow();
        }else{
          win.show();
        }
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip('This is my application')
  tray.setTitle('This is my title') //only works on macOS
  }
}



function createWindow() {
   win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.loadURL(
    isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build/index.html')}`
  );
  createTray();
  win.on('close', (event) => {
    event.preventDefault();
    win.hide();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', (e) => {
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
