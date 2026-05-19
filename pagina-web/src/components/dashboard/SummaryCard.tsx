import { CircleAlert, type LucideIcon } from 'lucide-react'

import { Card } from '../ui/Card'

interface SummaryCardProps {
  helper: string
  icon: LucideIcon
  iconClassName: string
  label: string
  value: string
}

export function SummaryCard({ helper, icon: Icon, iconClassName, label, value }: SummaryCardProps) {
  return (
    <Card className="flex h-full flex-col justify-between gap-5 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="group relative">
              <CircleAlert className="h-4 w-4 text-slate-300 transition group-hover:text-slate-500" />
              <div className="pointer-events-none absolute left-1/2 top-6 z-10 w-56 -translate-x-1/2 rounded-2xl bg-[#1A1A1B] px-3 py-2 text-xs leading-5 text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                {helper}
              </div>
            </div>
          </div>
          <strong className="mt-3 block text-[34px] font-semibold tracking-tight text-slate-950">{value}</strong>
        </div>
        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  )
}