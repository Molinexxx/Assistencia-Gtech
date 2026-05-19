export interface DesktopRuntimeConfig {
  apiBaseUrl: string
  appName: string
  healthUrl: string
  reconnectIntervalMs: number
  windowTitle: string
}

export interface BackendStatusPayload {
  checkedAt: string
  online: boolean
}

export interface ReconnectStatePayload {
  message: string
  visible: boolean
}

declare global {
  interface Window {
    desktop?: {
      getRuntimeConfig: () => Promise<DesktopRuntimeConfig>
      onAppReconnectState: (
        callback: (payload: ReconnectStatePayload) => void,
      ) => () => void
      onBackendStatusChange: (
        callback: (payload: BackendStatusPayload) => void,
      ) => () => void
    }
  }
}

export {}