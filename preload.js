//IPC COMMUNICATION 
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
  sendTodosToMain: (todos) => ipcRenderer.send("schedule-todos", todos),
  onWindowHidden: (callback) => ipcRenderer.on('window-hidden', callback),
  onWindowActivated: (callback) => ipcRenderer.on('window-activated', callback)
});