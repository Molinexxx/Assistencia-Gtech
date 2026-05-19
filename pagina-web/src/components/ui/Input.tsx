import { forwardRef, type InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '../../utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  icon?: LucideIcon
  label?: string
  wrapperClassName?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, icon: Icon, label, wrapperClassName, ...props },
  ref,
) {
  return (
    <label className={cn('flex flex-col gap-2 text-sm text-slate-700', wrapperClassName)}>
      {label ? <span className="font-medium">{label}</span> : null}
      <div className="relative">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        ) : null}
        <input
          ref={ref}
          className={cn(
            'h-12 w-full rounded-2xl border border-slate-200 bg-[#FBFCFE] px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#001F3F] focus:bg-white focus:ring-4 focus:ring-[#001F3F]/10',
            Icon ? 'pl-11' : '',
            error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : '',
            className,
          )}
          {...props}
        />
      </div>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
})