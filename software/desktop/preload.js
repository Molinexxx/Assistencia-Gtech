const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('desktop', {
  getRuntimeConfig: () => ipcRenderer.invoke('app:get-runtime-config'),
  onBackendStatusChange: (callback) => {
    const channel = 'backend:status-changed'
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on(channel, listener)

    return () => ipcRenderer.removeListener(channel, listener)
  },
  onAppReconnectState: (callback) => {
    const channel = 'app:reconnect-state'
    const listener = (_event, payload) => callback(payload)
    ipcRenderer.on(channel, listener)

    return () => ipcRenderer.removeListener(channel, listener)
  },
})