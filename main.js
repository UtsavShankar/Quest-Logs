const { app,Tray,Menu, BrowserWindow, nativeImage } = require('electron');
const path = require('path');
const { ipcMain, Notification } = require("electron");

const isDev = !app.isPackaged;
let tray = null;
let win = null;
let isQuitting = false;

function createTray() {
  if (!tray){
  const icon = nativeImage.createFromPath('' + path.join(__dirname, './src/assets/tray-icon-Template.png'));
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        console.log('Show App clicked');
        activateApp();
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
  }
}

function activateApp() {
  if(!win){
    createWindow();
  }else{
    win.show();
    win.focus();
  }
}

function createWindow() {
  app.setAppUserModelId("quest-logs");
   win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true
    }
  });

  win.loadURL(
    isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build/index.html')}`
  );

  createTray();

 const icon = nativeImage.createFromPath(path.join(__dirname, "./src/assets/app-icon.png"));
if (process.platform === 'darwin') {
  app.dock.setIcon(icon);
}

  app.on('before-quit', (event) => {
    isQuitting = true;
  })

  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      win.hide();
      win.webContents.send('window-hidden');
    }
  });

  app.on('activate', () => {
    activateApp();
    win.webContents.send('window-activated');
  });
}

function scheduleNotification(todo) {
  if (!todo.deadline || !todo.isNotifying){
    // console.log("No deadline or not notifying, skipping notification for", todo.title);
    return
  }; // skip if no deadline or not notifying


  const deadlineTime = new Date(`${todo.deadline}T00:00:00`).getTime();
  const now = Date.now();
  const delay = deadlineTime - now;

  if (delay <= 0) return; // already expired
  
  setTimeout(() => {
    new Notification({
      title: 'Quest Due!',
      body: `⏰ "${todo.title}" is due today!`,
    }).show();
  }, delay); 
}

// IPC code here 
ipcMain.on("schedule-todos", (event, todos) => {
  todos.forEach(scheduleNotification);
});


app.whenReady().then(createWindow);

app.on('window-all-closed', (e) => {
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
