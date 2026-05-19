import { Card } from '../components/ui/Card'

export function EstoquePage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="text-xl font-semibold text-slate-950">Modulo de estoque</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">A pagina fica protegida apenas para administradores. Ela pode receber na proxima iteracao a lista de pecas, alertas de minimo e ajustes de saldo do backend Spring Boot.</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>- Integrar <code>GET /estoque/pecas</code> para grade com filtros.</li>
          <li>- Integrar <code>GET /estoque/alertas/minimo</code> para cards de risco operacional.</li>
          <li>- Integrar <code>POST /estoque/pecas/{'{id}'}/ajustes</code> com confirmacao por modal.</li>
        </ul>
      </Card>
      <Card>
        <h3 className="text-xl font-semibold text-slate-950">Boas praticas</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">Exiba saldo atual, estoque minimo, custo medio e trilha de auditoria. Em caso de erro de concorrencia <code>409</code>, o frontend deve recarregar os dados e orientar o usuario a repetir o ajuste com a versao mais recente.</p>
      </Card>
    </div>
  )
}
