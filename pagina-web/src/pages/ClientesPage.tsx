import { Card } from '../components/ui/Card'

export function ClientesPage() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="text-xl font-semibold text-slate-950">Modulo de clientes</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">A rota esta pronta dentro da arquitetura protegida. O proximo passo natural e consumir os endpoints de clientes ja entregues no backend para cadastro, consulta e edicao.</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li>- Integrar <code>GET /clientes</code> para busca e autocomplete.</li>
          <li>- Integrar <code>POST /clientes</code> e <code>PUT /clientes/{'{id}'}</code> em modais reutilizaveis.</li>
          <li>- Reaproveitar o mesmo schema Zod e componentes de formulario do fluxo de OS.</li>
        </ul>
      </Card>
      <Card>
        <h3 className="text-xl font-semibold text-slate-950">UX recomendada</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">Para alto volume, use busca por nome, CPF/CNPJ e telefone com debounce no frontend e paginação server-side quando o modulo evoluir.</p>
      </Card>
    </div>
  )
}
