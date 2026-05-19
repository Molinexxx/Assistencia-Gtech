import axios from 'axios'

import { clearStoredSession, getStoredSession } from './storage'

const fallbackApiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'
const requestTimeoutMs = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 10000)
let runtimeApiBaseUrlPromise = null as Promise<string> | null

async function resolveApiBaseUrl() {
  if (!window.desktop?.getRuntimeConfig) {
    return fallbackApiBaseUrl
  }

  if (!runtimeApiBaseUrlPromise) {
    runtimeApiBaseUrlPromise = window.desktop
      .getRuntimeConfig()
      .then((config) => config.apiBaseUrl || fallbackApiBaseUrl)
      .catch(() => fallbackApiBaseUrl)
  }

  return runtimeApiBaseUrlPromise
}

export const apiClient = axios.create({
  baseURL: fallbackApiBaseUrl,
  timeout: requestTimeoutMs,
})

apiClient.interceptors.request.use(async (config) => {
  const session = getStoredSession()
  config.baseURL = await resolveApiBaseUrl()

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

      if (!window.location.hash.includes('/login') && window.location.pathname !== '/login') {
        window.location.href = window.location.protocol === 'file:' ? './#/login?expired=1' : '/login?expired=1'
      }
    }

    return Promise.reject(error)
  },
)