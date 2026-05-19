import { forwardRef, type TextareaHTMLAttributes } from 'react'

import { cn } from '../../utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  wrapperClassName?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, label, wrapperClassName, ...props },
  ref,
) {
  return (
    <label className={cn('flex flex-col gap-2 text-sm text-slate-700', wrapperClassName)}>
      {label ? <span className="font-medium">{label}</span> : null}
      <textarea
        ref={ref}
        className={cn(
          'min-h-28 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200',
          error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : '',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
})
