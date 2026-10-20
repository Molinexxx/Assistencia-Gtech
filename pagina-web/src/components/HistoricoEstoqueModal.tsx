import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { estoqueService } from '../services/estoqueService'
import type { EstoquePecaResponse, TipoMovimentoEstoque } from '../types/estoque'
import { getApiErrorMessage } from '../utils/api'
import { Button } from './ui/Button'
import { Modal } from './ui/Modal'

const movementLabels: Record<TipoMovimentoEstoque, string> = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída',
  AJUSTE_POSITIVO: 'Ajuste positivo',
  AJUSTE_NEGATIVO: 'Ajuste negativo',
  RESERVA: 'Reserva',
  ESTORNO: 'Estorno',
}

const incomingTypes = new Set<TipoMovimentoEstoque>(['ENTRADA', 'AJUSTE_POSITIVO', 'ESTORNO'])
const formatQuantity = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 3 })

interface HistoricoEstoqueModalProps {
  item: EstoquePecaResponse
  onClose: () => void
}

export function HistoricoEstoqueModal({ item, onClose }: HistoricoEstoqueModalProps) {
  const [page, setPage] = useState(0)
  const historyQuery = useQuery({
    queryKey: ['estoque-historico', item.id, page],
    queryFn: () => estoqueService.history(item.id, page),
  })
  const history = historyQuery.data

  return (
    <Modal open onClose={onClose} title="Histórico de estoque" description={`${item.nome} · ${item.sku}. Movimentações mais recentes primeiro.`}>
      <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
        {historyQuery.isPending ? <p role="status" className="py-8 text-center text-sm text-slate-500">Carregando movimentações...</p> : null}
        {historyQuery.isError ? (
          <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <p>{getApiErrorMessage(historyQuery.error)}</p>
            <Button className="mt-3" variant="secondary" disabled={historyQuery.isFetching} onClick={() => void historyQuery.refetch()}>Tentar novamente</Button>
          </div>
        ) : null}
        {!historyQuery.isError && history?.movimentacoes.length === 0 ? <p className="py-8 text-center text-sm text-slate-500">Esta peça ainda não tem movimentações registradas.</p> : null}
        {!historyQuery.isError && history && history.movimentacoes.length > 0 ? (
          <ol className="space-y-3" aria-label="Movimentações da peça">
            {history.movimentacoes.map((movement) => {
              const incoming = incomingTypes.has(movement.tipoMovimento)
              return (
                <li key={movement.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${incoming ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                      {movementLabels[movement.tipoMovimento]}: {incoming ? '+' : '−'}{formatQuantity(movement.quantidade)} {item.unidadeMedida}
                    </span>
                    <time className="text-xs text-slate-500" dateTime={movement.dataMovimento}>{new Date(movement.dataMovimento).toLocaleString('pt-BR')}</time>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">Saldo: <strong>{formatQuantity(movement.saldoAnterior)}</strong> → <strong>{formatQuantity(movement.saldoPosterior)} {item.unidadeMedida}</strong></p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm text-slate-700">Motivo: {movement.observacao || 'Não informado'}</p>
                  <p className="mt-2 text-xs text-slate-500">Registrado por: {movement.usuarioNome}</p>
                </li>
              )
            })}
          </ol>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">{history ? `${history.totalElementos} registro(s) · Página ${history.pagina + 1} de ${Math.max(1, history.totalPaginas)}` : 'Histórico da peça'}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" disabled={page === 0 || historyQuery.isFetching} onClick={() => setPage((current) => current - 1)}>Anterior</Button>
          <Button variant="secondary" disabled={!history || historyQuery.isError || historyQuery.isFetching || page + 1 >= history.totalPaginas} onClick={() => setPage((current) => current + 1)}>Próxima</Button>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </div>
    </Modal>
  )
}
