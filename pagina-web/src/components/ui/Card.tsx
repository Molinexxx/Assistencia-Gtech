import type { PropsWithChildren } from 'react'

import { cn } from '../../utils/cn'

interface CardProps extends PropsWithChildren {
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <section className={cn('rounded-[24px] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]', className)}>
      {children}
    </section>
  )
}