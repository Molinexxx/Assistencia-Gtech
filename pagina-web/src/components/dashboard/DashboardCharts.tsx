import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Card } from '../ui/Card'

interface ServicesByTechnicianDatum {
  tecnico: string
  total: number
}

interface WeekVolumeDatum {
  dia: string
  total: number
}

interface DashboardChartsProps {
  servicesByTechnician: ServicesByTechnicianDatum[]
  weekVolume: WeekVolumeDatum[]
}

function ChartTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: Array<{ value: number }> }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-lg">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="mt-1">Total: {payload[0]?.value ?? 0}</p>
    </div>
  )
}

export function DashboardCharts({ servicesByTechnician, weekVolume }: DashboardChartsProps) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Card className="min-h-[360px] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-950">Serviços por técnico</h3>
          <p className="mt-1 text-sm text-slate-500">Volume de ordens distribuídas por responsável técnico.</p>
        </div>
        <ResponsiveContainer width="100%" height={270}>
          <BarChart data={servicesByTechnician} barCategoryGap={34}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="tecnico" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0, 31, 63, 0.04)' }} />
            <Bar dataKey="total" fill="#001F3F" radius={[16, 16, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="min-h-[360px] p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-950">Volume de OS na semana</h3>
          <p className="mt-1 text-sm text-slate-500">Distribuição diária de entradas para medir gargalos no atendimento.</p>
        </div>
        <ResponsiveContainer width="100%" height={270}>
          <AreaChart data={weekVolume}>
            <defs>
              <linearGradient id="weeklyVolumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#001F3F" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#001F3F" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="dia" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area dataKey="total" type="monotone" stroke="#001F3F" strokeWidth={3} fill="url(#weeklyVolumeGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}