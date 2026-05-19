import { AuthProvider } from './contexts/AuthContext'
import { useDesktopConnection } from './hooks/useDesktopConnection'
import { AppRouter } from './router/AppRouter'
import { ReconnectOverlay } from './components/system/ReconnectOverlay'

function AppShell() {
  const { message, reconnectVisible } = useDesktopConnection()

  return (
    <>
      <ReconnectOverlay visible={reconnectVisible} message={message} />
      <AppRouter />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App