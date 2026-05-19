const fs = require('fs')
const path = require('path')
const { app } = require('electron')

const DEFAULT_CONFIG = {
  appName: 'GTech Assistencia Pro',
  apiBaseUrl: 'http://localhost:8080/api/v1',
  healthUrl: 'http://localhost:8080/actuator/health',
  reconnectIntervalMs: 5000,
  windowTitle: 'GTech Assistencia Pro',
}

function resolveExternalConfigPath() {
  if (app.isPackaged) {
    return path.join(path.dirname(process.execPath), 'app-config.json')
  }

  return path.join(process.cwd(), 'desktop', 'app-config.json')
}

function loadRuntimeConfig() {
  const externalPath = resolveExternalConfigPath()

  try {
    if (fs.existsSync(externalPath)) {
      const raw = fs.readFileSync(externalPath, 'utf-8')
      const parsed = JSON.parse(raw)

      return {
        ...DEFAULT_CONFIG,
        ...parsed,
      }
    }
  } catch (error) {
    console.error('[desktop-config] Falha ao ler app-config.json:', error)
  }

  return DEFAULT_CONFIG
}

module.exports = {
  loadRuntimeConfig,
  resolveExternalConfigPath,
}