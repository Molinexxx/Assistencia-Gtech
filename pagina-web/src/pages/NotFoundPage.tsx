import { Link } from 'react-router-dom'

import { Card } from '../components/ui/Card'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <Card className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-950">Pagina nao encontrada</h1>
        <p className="mt-4 text-sm text-slate-500">A rota solicitada nao existe ou voce nao tem permissao para acessa-la.</p>
        <Link className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800" to="/dashboard">
          Voltar para o dashboard
        </Link>
      </Card>
    </div>
  )
}
