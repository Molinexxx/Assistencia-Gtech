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
  open: 'bg-blue-50 text-[#001F3F]',
  pending: 'bg-amber-50 text-amber-700',
  revenue: 'bg-emerald-50 text-emerald-700',
} as const

const statusChartColors: Record<OrdemServicoStatus, string> = {
  EM_ANALISE: '#5B8FF9',
  AGUARDANDO_APROVACAO: '#7C3AED',
  EM_REPARO: '#0EA5E9',
  AGUARDANDO_PECA: '#F59E0B',
  FINALIZADA: '#10B981',
  ENTREGUE: '#14B8A6',
  CANCELADA: '#F43F5E',
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
        const tecnico = ordem.tecnicoId ? `Técnico #${ordem.tecnicoId}` : 'Sem técnico'
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
    <div className="space-y-4 lg:space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          helper="Ordens que ainda exigem acompanhamento operacional."
          icon={BriefcaseBusiness}
          iconClassName={summaryCardStyles.open}
          label="OS em aberto"
          value={String(metrics.osEmAberto)}
        />
        <SummaryCard
          helper="Receita consolidada pelas ordens registradas ao longo do dia atual."
          icon={CircleDollarSign}
          iconClassName={summaryCardStyles.revenue}
          label="Faturamento do dia"
          value={formatCurrency(metrics.faturamentoDia)}
        />
        <SummaryCard
          helper="Ordens aguardando aprovação ou peça para retomada do serviço."
          icon={Wrench}
          iconClassName={summaryCardStyles.pending}
          label="Aparelhos pendentes"
          value={String(metrics.pendentes)}
        />
        <SummaryCard
          helper="Base monitorada pelo dashboard para leitura de status e produtividade."
          icon={AlertTriangle}
          iconClassName={summaryCardStyles.monitored}
          label="OS monitoradas"
          value={String(metrics.totalOrdens)}
        />
      </section>

      <DashboardCharts servicesByTechnician={metrics.servicosPorTecnico} weekVolume={metrics.weekVolume} />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Fila operacional</h3>
              <p className="mt-1 text-sm text-slate-500">As cinco ordens mais recentes ajudam a equipe a priorizar o próximo passo.</p>
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
              <div key={ordem.id} className="flex flex-col gap-3 rounded-[20px] border border-slate-200/80 px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#001F3F]/15 hover:bg-slate-50/70 md:flex-row md:items-center md:justify-between">
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

        <Card>
          <h3 className="text-lg font-semibold text-slate-950">Distribuição por status</h3>
          <p className="mt-1 text-sm text-slate-500">Leitura semântica do pipeline atual da operação.</p>

          {metrics.statusDistribution.length > 0 ? (
            <>
              <div className="mt-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.statusDistribution}
                      dataKey="total"
                      nameKey="label"
                      innerRadius={56}
                      outerRadius={84}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {metrics.statusDistribution.map((item) => (
                        <Cell key={item.status} fill={item.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Ordens']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4">
                {metrics.statusDistribution.map((item) => (
                  <div key={item.status} className="flex items-center justify-between gap-3 text-sm">
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
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">Sem dados para exibir distribuição.</div>
          )}
        </Card>
      </section>
    </div>
  )
}