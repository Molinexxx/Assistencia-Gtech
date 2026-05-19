const http = require('http')
const https = require('https')

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http

      const request = client.get(url, { timeout: 3000 }, (response) => {
        resolve(response.statusCode >= 200 && response.statusCode < 500)
        response.resume()
      })

      request.on('timeout', () => {
        request.destroy()
        resolve(false)
      })

      request.on('error', () => resolve(false))
    } catch (_error) {
      resolve(false)
    }
  })
}

function startHealthMonitor({ browserWindow, config }) {
  let lastStatus = null

  const runCheck = async () => {
    const isOnline = await checkUrl(config.healthUrl)

    if (lastStatus !== isOnline) {
      lastStatus = isOnline

      browserWindow.webContents.send('backend:status-changed', {
        checkedAt: new Date().toISOString(),
        online: isOnline,
      })

      browserWindow.webContents.send('app:reconnect-state', {
        message: isOnline ? '' : 'Tentando reconectar ao servidor...',
        visible: !isOnline,
      })
    }
  }

  void runCheck()
  const intervalId = setInterval(runCheck, config.reconnectIntervalMs)

  return () => clearInterval(intervalId)
}

module.exports = {
  startHealthMonitor,
}