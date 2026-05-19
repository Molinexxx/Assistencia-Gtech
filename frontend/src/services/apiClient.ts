import axios from 'axios'

import { clearStoredSession, getStoredSession } from './storage'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 10000),
})

apiClient.interceptors.request.use((config) => {
  const session = getStoredSession()

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status as number | undefined
    const requestUrl = error.config?.url as string | undefined
    const isLoginRequest = requestUrl?.includes('/auth/login')

    if (status === 401 && !isLoginRequest) {
      clearStoredSession()

      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=1'
      }
    }

    return Promise.reject(error)
  },
)
