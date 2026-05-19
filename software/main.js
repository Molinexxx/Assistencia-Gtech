const path = require('path')
const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron')

const { loadRuntimeConfig } = require('./desktop/config.service')
const { startHealthMonitor } = require('./desktop/health.service')

let mainWindow = null
let stopHealthMonitor = null
const runtimeConfig = loadRuntimeConfig()

function blockUnsafeNavigation(win) {
  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url)
    return { action: 'deny' }
  })

  win.webContents.on('will-navigate', (event, url) => {
    const currentUrl = win.webContents.getURL()

    if (currentUrl && url !== currentUrl) {
      event.preventDefault()
    }
  })
}

function blockDeveloperShortcuts(win) {
  win.webContents.on('before-input-event', (event, input) => {
    const key = input.key?.toUpperCase()

    const blocked =
      key === 'F12' ||
      (input.control && input.shift && ['I', 'J', 'C'].includes(key)) ||
      (input.control && key === 'R') ||
      key === 'F5'

    if (blocked && app.isPackaged) {
      event.preventDefault()
    }
  })
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: runtimeConfig.windowTitle,
    show: false,
    backgroundColor: '#0f172a',
    autoHideMenuBar: true,
    width: 1440,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    webPreferences: {
      preload: path.join(__dirname, 'desktop', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  })

  Menu.setApplicationMenu(null)
  mainWindow.maximize()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('unmaximize', () => {
    if (app.isPackaged) {
      mainWindow.maximize()
    }
  })

  mainWindow.on('leave-full-screen', () => {
    if (app.isPackaged) {
      mainWindow.maximize()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null

    if (stopHealthMonitor) {
      stopHealthMonitor()
      stopHealthMonitor = null
    }
  })

  blockUnsafeNavigation(mainWindow)
  blockDeveloperShortcuts(mainWindow)

  const indexPath = path.join(__dirname, '..', 'pagina-web', 'dist', 'index.html')
  void mainWindow.loadFile(indexPath)

  stopHealthMonitor = startHealthMonitor({
    browserWindow: mainWindow,
    config: runtimeConfig,
  })
}

app.whenReady().then(() => {
  ipcMain.handle('app:get-runtime-config', async () => runtimeConfig)
  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})