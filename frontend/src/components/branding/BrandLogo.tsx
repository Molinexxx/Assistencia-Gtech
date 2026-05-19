import { useState } from 'react'

import { cn } from '../../utils/cn'

interface BrandLogoProps {
  className?: string
  imageClassName?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  lg: {
    image: 'h-20 w-20 rounded-[24px]',
    subtitle: 'text-xs tracking-[0.3em]',
    title: 'text-2xl',
  },
  md: {
    image: 'h-14 w-14 rounded-2xl',
    subtitle: 'text-[11px] tracking-[0.24em]',
    title: 'text-lg',
  },
  sm: {
    image: 'h-10 w-10 rounded-xl',
    subtitle: 'text-[10px] tracking-[0.22em]',
    title: 'text-sm',
  },
} as const

export function BrandLogo({ className, imageClassName, showText = true, size = 'md' }: BrandLogoProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const scale = sizeClasses[size]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {!imageFailed ? (
        <img
          src="/logo-gtech.png"
          alt="Logo G-TECH"
          className={cn(scale.image, 'border border-white/10 object-cover shadow-[0_10px_25px_rgba(2,6,23,0.25)]', imageClassName)}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className={cn(scale.image, 'inline-flex items-center justify-center bg-[#001F3F] font-semibold text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)]', imageClassName)}>
          GT
        </div>
      )}

      {showText ? (
        <div>
          <p className={cn('font-semibold uppercase text-slate-400', scale.subtitle)}>G-TECH</p>
          <h1 className={cn('font-semibold tracking-tight text-white', scale.title)}>Assistência Pro</h1>
        </div>
      ) : null}
    </div>
  )
}