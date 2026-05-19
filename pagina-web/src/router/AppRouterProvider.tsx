import type { PropsWithChildren } from 'react'
import { BrowserRouter, HashRouter } from 'react-router-dom'

export function AppRouterProvider({ children }: PropsWithChildren) {
  const Router = window.location.protocol === 'file:' ? HashRouter : BrowserRouter

  return <Router>{children}</Router>
}