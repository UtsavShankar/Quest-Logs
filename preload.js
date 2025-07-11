//IPC COMMUNICATION 
const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
  sendTodosToMain: (todos) => ipcRenderer.send("schedule-todos", todos)
});