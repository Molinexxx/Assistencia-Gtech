import { Filter, PlusCircle, RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { OrdemServicoTable } from '../components/os/OrdemServicoTable'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { useAuth } from '../hooks/useAuth'
import { useOrdemServico } from '../hooks/useOrdemServico'
import type { OrdemServicoStatus } from '../types/ordem-servico'

export function OrdensServicoPage() {
  const [codigo, setCodigo] = useState('')
  const [imei, setImei] = useState('')
  const [status, setStatus] = useState<OrdemServicoStatus | ''>('')
  const { hasRole } = useAuth()
  const filters = useMemo(() => ({ codigo, imei, status }), [codigo, imei, status])
  const { errorMessage, ordensQuery, updateStatusMutation } = useOrdemServico(filters)

  return (
    <div className="space-y-4">
      <Card>
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr_220px_auto]">
          <Input label="Buscar por codigo" placeholder="OS-2026-AB12CD34" value={codigo} onChange={(event) => setCodigo(event.target.value)} />
          <Input label="Buscar por IMEI" placeholder="IMEI do aparelho" value={imei} onChange={(event) => setImei(event.target.value)} />
          <Select label="Status" value={status} onChange={(event) => setStatus(event.target.value as OrdemServicoStatus | '')}>
            <option value="">Todos</option>
            <option value="EM_ANALISE">Em analise</option>
            <option value="AGUARDANDO_APROVACAO">Aguardando aprovacao</option>
            <option value="EM_REPARO">Em reparo</option>
            <option value="AGUARDANDO_PECA">Aguardando peca</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="ENTREGUE">Entregue</option>
            <option value="CANCELADA">Cancelada</option>
          </Select>
          <div className="flex items-end gap-3">
            <Button variant="secondary" className="flex-1 justify-center" onClick={() => ordensQuery.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar
            </Button>
            {hasRole('ADMIN', 'ATENDENTE') ? (
              <Link className="inline-flex h-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800" to="/ordens-servico/nova">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova OS
              </Link>
            ) : null}
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Consulta operacional</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">Listagem de ordens de servico</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
          <Filter className="h-4 w-4" />
          {ordensQuery.data?.length ?? 0} resultado(s)
        </div>
      </Card>

      {ordensQuery.isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}
      {updateStatusMutation.isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}
      {updateStatusMutation.isSuccess ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">Status da OS atualizado com sucesso.</div> : null}

      {ordensQuery.isLoading ? <Card className="text-sm text-slate-500">Carregando ordens de servico...</Card> : null}
      {!ordensQuery.isLoading && (ordensQuery.data?.length ?? 0) === 0 ? <Card className="text-sm text-slate-500">Nenhuma ordem encontrada para os filtros informados.</Card> : null}
      {ordensQuery.data?.length ? <OrdemServicoTable isSaving={updateStatusMutation.isPending} onUpdateStatus={(payload) => updateStatusMutation.mutate(payload)} ordens={ordensQuery.data} /> : null}
    </div>
  )
}
