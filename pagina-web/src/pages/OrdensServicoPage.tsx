import { Filter, PlusCircle, RefreshCw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { OrdemServicoTable } from '../components/os/OrdemServicoTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useAuth } from '../hooks/useAuth'
import { useOrdemServico } from '../hooks/useOrdemServico'
import type { OrdemServicoResponse, OrdemServicoStatus } from '../types/ordem-servico'

function matchesGlobalSearch(ordem: OrdemServicoResponse, term: string) {
  const normalized = term.trim().toLowerCase()
  if (!normalized) {
    return true
  }

  return [
    ordem.clienteNome,
    ordem.clienteCpfCnpj,
    ordem.clienteTelefone,
    ordem.codigo,
    ordem.aparelhoDescricao,
    ordem.imeiConfirmado,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(normalized)
}

export function OrdensServicoPage() {
  const [codigo, setCodigo] = useState('')
  const [imei, setImei] = useState('')
  const [status, setStatus] = useState<OrdemServicoStatus | ''>('')
  const [globalClientSearch, setGlobalClientSearch] = useState('')
  const { hasRole } = useAuth()
  const filters = useMemo(() => ({ codigo, imei, status }), [codigo, imei, status])
  const { errorMessage, ordensQuery, updateStatusMutation } = useOrdemServico(filters)

  const filteredOrders = useMemo(() => (
    (ordensQuery.data ?? []).filter((ordem) => matchesGlobalSearch(ordem, globalClientSearch))
  ), [globalClientSearch, ordensQuery.data])

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_220px_auto]">
          <Input
            icon={Search}
            label="Busca global de clientes"
            placeholder="Nome, CPF ou telefone"
            value={globalClientSearch}
            onChange={(event) => setGlobalClientSearch(event.target.value)}
          />
          <Input label="Buscar por código" placeholder="OS-2026-AB12CD34" value={codigo} onChange={(event) => setCodigo(event.target.value)} />
          <Input label="Buscar por IMEI" placeholder="IMEI do aparelho" value={imei} onChange={(event) => setImei(event.target.value)} />
          <div className="flex items-end gap-3">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => ordensQuery.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            {hasRole('ADMIN', 'ATENDENTE') ? (
              <Link className="inline-flex h-11 items-center justify-center rounded-xl bg-[#001F3F] px-4 text-sm font-medium text-white transition hover:bg-[#03294f]" to="/ordens-servico/nova">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova OS
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
          <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as OrdemServicoStatus | '')}>
            <option value="">Todos</option>
            <option value="EM_ANALISE">Em análise</option>
            <option value="AGUARDANDO_APROVACAO">Aguardando aprovação</option>
            <option value="EM_REPARO">Em reparo</option>
            <option value="AGUARDANDO_PECA">Aguardando peça</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="ENTREGUE">Entregue</option>
            <option value="CANCELADA">Cancelada</option>
          </Select>
          <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            O filtro de cliente funciona instantaneamente em cima da lista carregada, sem exigir novos cliques do operador.
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Consulta operacional</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Listagem de ordens de serviço</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
          <Filter className="h-4 w-4" />
          {filteredOrders.length} resultado(s)
        </div>
      </Card>

      {ordensQuery.isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}
      {updateStatusMutation.isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}
      {updateStatusMutation.isSuccess ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Status da OS atualizado com sucesso.</div> : null}

      {ordensQuery.isLoading ? <Card className="text-sm text-slate-500">Carregando ordens de serviço...</Card> : null}
      {!ordensQuery.isLoading && filteredOrders.length === 0 ? <Card className="text-sm text-slate-500">Nenhuma ordem encontrada para os filtros informados.</Card> : null}
      {filteredOrders.length ? <OrdemServicoTable isSaving={updateStatusMutation.isPending} onUpdateStatus={(payload) => updateStatusMutation.mutate(payload)} ordens={filteredOrders} /> : null}
    </div>
  )
}