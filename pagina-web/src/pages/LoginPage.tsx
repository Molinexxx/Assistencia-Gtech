import { LogIn, ShieldCheck } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { BrandLogo } from '../components/branding/BrandLogo'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { getApiErrorMessage } from '../utils/api'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', username: '' })
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate replace to="/dashboard" />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await login(form)
      const redirectTarget = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/dashboard'
      navigate(redirectTarget, { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl shadow-slate-950/40">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-300">
            <ShieldCheck className="h-4 w-4" />
            Plataforma premium G-TECH
          </span>
          <div className="mt-8 flex items-center gap-4">
            <BrandLogo size="lg" />
          </div>
          <h1 className="mt-8 max-w-xl text-4xl font-semibold leading-tight">Operação da assistência técnica com autenticação JWT, dashboard e abertura de OS em etapas.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">A interface foi preparada para integrar com o backend Spring Boot, protegendo rotas por perfil e simplificando o trabalho de atendentes, técnicos e gestores.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card className="border-white/10 bg-white/5 text-white">
              <strong className="text-3xl">30s</strong>
              <p className="mt-2 text-sm text-slate-300">Cache otimizado com React Query para reduzir chamadas repetidas.</p>
            </Card>
            <Card className="border-white/10 bg-white/5 text-white">
              <strong className="text-3xl">JWT</strong>
              <p className="mt-2 text-sm text-slate-300">Interceptor envia token automaticamente e redireciona em expiração.</p>
            </Card>
            <Card className="border-white/10 bg-white/5 text-white">
              <strong className="text-3xl">3 passos</strong>
              <p className="mt-2 text-sm text-slate-300">Formulário de abertura focado em coleta limpa de dados e checklist.</p>
            </Card>
          </div>
        </section>

        <Card className="flex items-center justify-center rounded-[32px] p-8">
          <form className="w-full max-w-md space-y-5" onSubmit={handleSubmit}>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Login seguro</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-950">Acesse o painel</h2>
              <p className="mt-3 text-sm text-slate-500">Use as credenciais do backend Spring Boot para abrir a aplicação.</p>
            </div>

            <Input label="Usuário" placeholder="admin" value={form.username} onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))} />
            <Input label="Senha" placeholder="Sua senha" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />

            {location.search.includes('expired=1') ? <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">Sua sessão expirou. Entre novamente para continuar.</div> : null}
            {errorMessage ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}

            <Button className="w-full justify-center" size="lg" type="submit" disabled={isSubmitting}>
              <LogIn className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Entrando...' : 'Entrar no sistema'}
            </Button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              <p className="font-semibold text-slate-700">Exemplo local</p>
              <p className="mt-1">Backend: <code>http://localhost:8080/api/v1</code></p>
              <p className="mt-1">Usuário bootstrap: <code>admin</code></p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}