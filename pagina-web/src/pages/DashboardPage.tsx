import { AlertTriangle, BriefcaseBusiness, CircleDollarSign, Eye, Wrench } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { DashboardCharts } from '../components/dashboard/DashboardCharts'
import { SummaryCard } from '../components/dashboard/SummaryCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useOrdemServico } from '../hooks/useOrdemServico'
import type { OrdemServicoResponse, OrdemServicoStatus } from '../types/ordem-servico'
import { formatCurrency, formatStatusLabel, toWeekdayLabel } from '../utils/format'

const EMPTY_ORDENS: OrdemServicoResponse[] = []

const summaryCardStyles = {
  monitored: 'bg-indigo-50 text-indigo-700',
  open: 'bg-blue-50 text-[#1D4ED8]',
  pending: 'bg-amber-50 text-[#C2410C]',
  revenue: 'bg-emerald-50 text-[#15803D]',
} as const

const statusChartColors: Record<OrdemServicoStatus, string> = {
  EM_ANALISE: '#60A5FA',
  AGUARDANDO_APROVACAO: '#818CF8',
  EM_REPARO: '#2563EB',
  AGUARDANDO_PECA: '#F59E0B',
  FINALIZADA: '#10B981',
  ENTREGUE: '#14B8A6',
  CANCELADA: '#F43F5E',
}

function DonutTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload?: { label: string; total: number } }> }) {
  if (!active || !payload?.length || !payload[0]?.payload) {
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-lg">
      <p className="font-semibold text-slate-900">{payload[0].payload.label}</p>
      <p className="mt-1">Ordens: {payload[0].payload.total}</p>
    </div>
  )
}

export function DashboardPage() {
  const { errorMessage, ordensQuery } = useOrdemServico()
  const ordens = ordensQuery.data ?? EMPTY_ORDENS

  const metrics = useMemo(() => {
    const today = new Date().toDateString()
    const openStatuses = new Set<OrdemServicoStatus>(['EM_ANALISE', 'AGUARDANDO_APROVACAO', 'EM_REPARO', 'AGUARDANDO_PECA'])
    const pendingStatuses = new Set<OrdemServicoStatus>(['AGUARDANDO_APROVACAO', 'AGUARDANDO_PECA'])

    const osEmAberto = ordens.filter((ordem) => openStatuses.has(ordem.status)).length
    const pendentes = ordens.filter((ordem) => pendingStatuses.has(ordem.status)).length
    const faturamentoDia = ordens
      .filter((ordem) => new Date(ordem.dataEntrada).toDateString() === today)
      .reduce((total, ordem) => total + ordem.valorTotal, 0)

    const servicosPorTecnico = Object.values(
      ordens.reduce<Record<string, { tecnico: string; total: number }>>((accumulator, ordem) => {
        const tecnico = ordem.tecnicoId ? `Tecnico #${ordem.tecnicoId}` : 'Sem tecnico'
        accumulator[tecnico] ??= { tecnico, total: 0 }
        accumulator[tecnico].total += 1
        return accumulator
      }, {}),
    )

    const weekVolume = Array.from({ length: 7 }, (_, index) => {
      const date = new Date()
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() - (6 - index))

      const total = ordens.filter((ordem) => {
        const createdAt = new Date(ordem.dataEntrada)
        createdAt.setHours(0, 0, 0, 0)
        return createdAt.getTime() === date.getTime()
      }).length

      return {
        dia: toWeekdayLabel(date.toISOString()),
        total,
      }
    })

    const statusDistribution = Object.values(
      ordens.reduce<Record<OrdemServicoStatus, { color: string; label: string; status: OrdemServicoStatus; total: number }>>((accumulator, ordem) => {
        accumulator[ordem.status] ??= {
          color: statusChartColors[ordem.status],
          label: formatStatusLabel(ordem.status),
          status: ordem.status,
          total: 0,
        }
        accumulator[ordem.status].total += 1
        return accumulator
      }, {} as Record<OrdemServicoStatus, { color: string; label: string; status: OrdemServicoStatus; total: number }>),
    )

    return {
      faturamentoDia,
      osEmAberto,
      pendentes,
      servicosPorTecnico,
      statusDistribution,
      totalOrdens: ordens.length,
      weekVolume,
    }
  }, [ordens])

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard helper="Ordens que ainda exigem acompanhamento operacional." icon={BriefcaseBusiness} iconClassName={summaryCardStyles.open} label="OS em aberto" value={String(metrics.osEmAberto)} />
        <SummaryCard helper="Receita consolidada pelas ordens registradas ao longo do dia atual." icon={CircleDollarSign} iconClassName={summaryCardStyles.revenue} label="Faturamento do dia" value={formatCurrency(metrics.faturamentoDia)} />
        <SummaryCard helper="Ordens aguardando aprovacao ou peca para retomada do servico." icon={Wrench} iconClassName={summaryCardStyles.pending} label="Pendencias" value={String(metrics.pendentes)} />
        <SummaryCard helper="Base monitorada pelo dashboard para leitura de status e produtividade." icon={AlertTriangle} iconClassName={summaryCardStyles.monitored} label="OS monitoradas" value={String(metrics.totalOrdens)} />
      </section>

      <DashboardCharts servicesByTechnician={metrics.servicosPorTecnico} weekVolume={metrics.weekVolume} />

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Fila operacional</h3>
              <p className="mt-1 text-sm text-slate-500">As cinco ordens mais recentes ajudam a equipe a priorizar o proximo passo.</p>
            </div>
            <div className="flex items-center gap-3">
              {ordensQuery.isLoading ? <span className="text-sm text-slate-500">Carregando...</span> : null}
              <Link to="/ordens-servico">
                <Button variant="secondary">
                  <Eye className="mr-2 h-4 w-4" />
                  Ver tudo
                </Button>
              </Link>
            </div>
          </div>

          {ordensQuery.isError ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}

          <div className="mt-6 space-y-3">
            {ordens.slice(0, 5).map((ordem) => (
              <div key={ordem.id} className="flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-white px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#001F3F]/15 hover:bg-slate-50 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold text-slate-950">{ordem.codigo} - {ordem.clienteNome}</p>
                  <p className="mt-1 text-sm text-slate-500">{ordem.aparelhoDescricao}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={ordem.status} />
                  <span className="text-sm font-medium text-slate-950">{formatCurrency(ordem.valorTotal)}</span>
                </div>
              </div>
            ))}
            {!ordensQuery.isLoading && ordens.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">Nenhuma OS encontrada. Abra a primeira ordem para popular o dashboard.</div> : null}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-950">Distribuicao por status</h3>
          <p className="mt-1 text-sm text-slate-500">Leitura semantica do pipeline atual da operacao.</p>

          {metrics.statusDistribution.length > 0 ? (
            <>
              <div className="relative mt-6 h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={metrics.statusDistribution} dataKey="total" nameKey="label" innerRadius={62} outerRadius={90} paddingAngle={3} stroke="none">
                      {metrics.statusDistribution.map((item) => (
                        <Cell key={item.status} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<DonutTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Total</span>
                  <strong className="mt-2 text-3xl font-semibold text-slate-950">{metrics.totalOrdens}</strong>
                </div>
              </div>

              <div className="space-y-3">
                {metrics.statusDistribution.map((item) => (
                  <div key={item.status} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span>{item.label}</span>
                    </div>
                    <strong className="text-slate-950">{item.total}</strong>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">Sem dados para exibir distribuicao.</div>
          )}
        </Card>
      </section>
    </div>
  )
}