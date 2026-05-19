import { useState } from 'react'
import { Eye, Save } from 'lucide-react'
import { Link } from 'react-router-dom'

import type { OrdemServicoResponse, OrdemServicoStatus } from '../../types/ordem-servico'
import { formatCurrency, formatDateTime } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Select } from '../ui/Select'

interface OrdemServicoTableProps {
  isSaving: boolean
  onUpdateStatus: (payload: { id: number; status: OrdemServicoStatus; version: number }) => void
  ordens: OrdemServicoResponse[]
}

function StatusAction({
  isSaving,
  onUpdateStatus,
  ordem,
}: {
  isSaving: boolean
  onUpdateStatus: (payload: { id: number; status: OrdemServicoStatus; version: number }) => void
  ordem: OrdemServicoResponse
}) {
  const [draftStatus, setDraftStatus] = useState<OrdemServicoStatus>(ordem.status)

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center">
      <Select className="min-w-48" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as OrdemServicoStatus)}>
        <option value="EM_ANALISE">Em analise</option>
        <option value="AGUARDANDO_APROVACAO">Aguardando aprovacao</option>
        <option value="EM_REPARO">Em reparo</option>
        <option value="AGUARDANDO_PECA">Aguardando peca</option>
        <option value="FINALIZADA">Finalizada</option>
        <option value="ENTREGUE">Entregue</option>
        <option value="CANCELADA">Cancelada</option>
      </Select>
      <Button size="sm" onClick={() => onUpdateStatus({ id: ordem.id, status: draftStatus, version: ordem.version })} disabled={isSaving || draftStatus === ordem.status}>
        <Save className="mr-2 h-4 w-4" />
        Salvar
      </Button>
    </div>
  )
}

export function OrdemServicoTable({ isSaving, onUpdateStatus, ordens }: OrdemServicoTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">OS</th>
              <th className="px-5 py-4 font-semibold">Cliente</th>
              <th className="px-5 py-4 font-semibold">Aparelho</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Valor</th>
              <th className="px-5 py-4 font-semibold">Entrada</th>
              <th className="px-5 py-4 font-semibold">Acao</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
            {ordens.map((ordem) => (
              <tr key={ordem.id} className="align-top">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-950">{ordem.codigo}</div>
                  <div className="mt-1 text-xs text-slate-500">ID #{ordem.id}</div>
                </td>
                <td className="px-5 py-4">{ordem.clienteNome}</td>
                <td className="px-5 py-4">{ordem.aparelhoDescricao}</td>
                <td className="px-5 py-4">
                  <Badge status={ordem.status} />
                </td>
                <td className="px-5 py-4 font-medium text-slate-950">{formatCurrency(ordem.valorTotal)}</td>
                <td className="px-5 py-4">{formatDateTime(ordem.dataEntrada)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-3">
                    <StatusAction isSaving={isSaving} onUpdateStatus={onUpdateStatus} ordem={ordem} />
                    <Link className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-950" to="/ordens-servico">
                      <Eye className="h-4 w-4" />
                      Atualizacao rapida
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
