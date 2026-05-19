import { useEffect, useState } from 'react'

import type { BackendStatusPayload, ReconnectStatePayload } from '../types/desktop'

export function useDesktopConnection() {
  const [backendOnline, setBackendOnline] = useState(true)
  const [message, setMessage] = useState('')
  const [reconnectVisible, setReconnectVisible] = useState(false)

  useEffect(() => {
    if (!window.desktop) {
      return undefined
    }

    const unsubscribeBackend = window.desktop.onBackendStatusChange((payload: BackendStatusPayload) => {
      setBackendOnline(payload.online)
    })

    const unsubscribeReconnect = window.desktop.onAppReconnectState((payload: ReconnectStatePayload) => {
      setMessage(payload.message)
      setReconnectVisible(payload.visible)
    })

    return () => {
      unsubscribeBackend?.()
      unsubscribeReconnect?.()
    }
  }, [])

  return {
    backendOnline,
    message,
    reconnectVisible,
  }
}