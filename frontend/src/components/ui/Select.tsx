import { forwardRef, type SelectHTMLAttributes } from 'react'

import { cn } from '../../utils/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  label?: string
  wrapperClassName?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { children, className, error, label, wrapperClassName, ...props },
  ref,
) {
  return (
    <label className={cn('flex flex-col gap-2 text-sm text-slate-700', wrapperClassName)}>
      {label ? <span className="font-medium">{label}</span> : null}
      <select
        ref={ref}
        className={cn(
          'h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : '',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
})
