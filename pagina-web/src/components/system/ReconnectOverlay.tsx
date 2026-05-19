interface ReconnectOverlayProps {
  message?: string
  visible: boolean
}

export function ReconnectOverlay({
  message = 'Tentando reconectar ao servidor...',
  visible,
}: ReconnectOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 text-center text-white shadow-2xl">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-400" />
        <h2 className="text-xl font-semibold">Conexao indisponivel</h2>
        <p className="mt-3 text-sm text-slate-300">{message}</p>
        <p className="mt-2 text-xs text-slate-500">
          O sistema continuara tentando restabelecer a comunicacao automaticamente.
        </p>
      </div>
    </div>
  )
}