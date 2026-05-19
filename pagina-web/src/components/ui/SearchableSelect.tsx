import { Search, ChevronDown, Check } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '../../utils/cn'

export interface SearchableSelectOption {
  value: string
  label: string
  helper?: string
  keywords?: string[]
}

interface SearchableSelectProps {
  autoFocus?: boolean
  className?: string
  disabled?: boolean
  emptyMessage?: string
  error?: string
  label?: string
  onChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  value?: string
  wrapperClassName?: string
}

export function SearchableSelect({
  autoFocus,
  className,
  disabled,
  emptyMessage = 'Nenhum resultado encontrado.',
  error,
  label,
  onChange,
  options,
  placeholder = 'Selecione',
  searchPlaceholder = 'Buscar...',
  value,
  wrapperClassName,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLInputElement | null>(null)

  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return options
    }

    return options.filter((option) => {
      const haystack = [option.label, option.helper, ...(option.keywords ?? [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [options, query])

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      return undefined
    }

    searchRef.current?.focus()

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [isOpen])

  return (
    <label className={cn('flex flex-col gap-2 text-sm text-slate-700', wrapperClassName)}>
      {label ? <span className="font-medium">{label}</span> : null}
      <div className="relative" ref={containerRef}>
        <button
          autoFocus={autoFocus}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-2xl border border-slate-200 bg-[#FBFCFE] px-3 text-left text-sm text-slate-900 shadow-sm outline-none transition focus:border-[#001F3F] focus:bg-white focus:ring-4 focus:ring-[#001F3F]/10',
            error ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : '',
            disabled ? 'cursor-not-allowed opacity-60' : '',
            className,
          )}
          disabled={disabled}
          onClick={() => setIsOpen((open) => !open)}
          type="button"
        >
          <span className="min-w-0">
            <span className={cn('block truncate font-medium', selectedOption ? 'text-slate-950' : 'text-slate-400')}>
              {selectedOption?.label ?? placeholder}
            </span>
            {selectedOption?.helper ? <span className="mt-0.5 block truncate text-xs text-slate-500">{selectedOption.helper}</span> : null}
          </span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition', isOpen ? 'rotate-180' : '')} />
        </button>

        {isOpen ? (
          <div className="absolute z-30 mt-2 w-full rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_24px_48px_rgba(15,23,42,0.18)]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchRef}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#001F3F] focus:bg-white focus:ring-4 focus:ring-[#001F3F]/10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                value={query}
              />
            </div>
            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto pr-1">
              {filteredOptions.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-3 py-4 text-sm text-slate-500">{emptyMessage}</div>
              ) : null}
              {filteredOptions.map((option) => {
                const selected = option.value === value
                return (
                  <button
                    key={option.value}
                    className={cn('flex w-full items-start justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-slate-50', selected ? 'bg-[#001F3F]/6 text-[#001F3F]' : 'text-slate-700')}
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    type="button"
                  >
                    <span>
                      <span className="block font-medium">{option.label}</span>
                      {option.helper ? <span className="mt-1 block text-xs text-slate-500">{option.helper}</span> : null}
                    </span>
                    {selected ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : null}
                  </button>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}