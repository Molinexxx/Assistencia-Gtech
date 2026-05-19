import { Delete, ShieldEllipsis } from 'lucide-react'

import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

interface PinPadProps {
  disabled?: boolean
  onChange: (value: string) => void
  value: string
}

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

export function PinPad({ disabled, onChange, value }: PinPadProps) {
  return (
    <div className="gtech-pinpad-surface rounded-[28px] border border-slate-200 p-5 text-white">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">PIN pad visual</p>
          <p className="mt-2 text-sm text-slate-300">Digite a senha pelo mouse ou toque e reduza erro de digitacao no balcao.</p>
        </div>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white">
          <ShieldEllipsis className="h-5 w-5" />
        </span>
      </div>

      <div className="mt-5 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-center text-2xl font-semibold tracking-[0.35em]">
        {value ? value.replace(/./g, '*') : '----'}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {digits.slice(0, 9).map((digit) => (
          <button
            key={digit}
            className={cn('gtech-pinpad-key rounded-2xl px-4 py-4 text-lg font-semibold transition hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40', disabled ? 'cursor-not-allowed opacity-50' : '')}
            disabled={disabled}
            onClick={() => onChange(`${value}${digit}`)}
            type="button"
          >
            {digit}
          </button>
        ))}
        <Button className="rounded-2xl border border-amber-300/30 bg-amber-400/10 text-amber-100 hover:bg-amber-400/20" disabled={disabled} onClick={() => onChange('')} type="button" variant="ghost">
          Limpar
        </Button>
        <button
          className={cn('gtech-pinpad-key rounded-2xl px-4 py-4 text-lg font-semibold transition hover:bg-white/14 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40', disabled ? 'cursor-not-allowed opacity-50' : '')}
          disabled={disabled}
          onClick={() => onChange(`${value}${digits[9]}`)}
          type="button"
        >
          0
        </button>
        <Button className="rounded-2xl border border-rose-300/30 bg-rose-400/10 text-rose-100 hover:bg-rose-400/20" disabled={disabled} onClick={() => onChange(value.slice(0, -1))} type="button" variant="ghost">
          <Delete className="mr-2 h-4 w-4" />
          Apagar
        </Button>
      </div>
    </div>
  )
}