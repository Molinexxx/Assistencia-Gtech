import { FileText, MessageCircleMore, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { NovaOrdemServicoForm } from '../components/os/NovaOrdemServicoForm'
import { Card } from '../components/ui/Card'

export function NovaOrdemServicoPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ordemServicoId = Number(searchParams.get('editar'))
  const isEditing = Number.isFinite(ordemServicoId) && ordemServicoId > 0

  const sideNotes = useMemo(() => ([
    {
      description: 'Ao editar uma OS, o formulário preserva o código e reaproveita cliente, aparelho, checklist e peças já vinculadas.',
      icon: FileText,
      title: isEditing ? 'Edição completa habilitada' : 'Abertura em 3 etapas',
      tone: 'bg-blue-100 text-blue-700',
    },
    {
      description: 'Use o PIN pad visual para registrar senha do aparelho com mouse ou toque, reduzindo erro operacional no balcão.',
      icon: MessageCircleMore,
      title: 'Atendimento mais rápido',
      tone: 'bg-emerald-100 text-emerald-700',
    },
    {
      description: 'Marca, modelo e técnico usam busca interna para exibir nomes amigáveis e agilizar a navegação por teclado.',
      icon: ShieldCheck,
      title: 'Fluxo premium e seguro',
      tone: 'bg-amber-100 text-amber-700',
    },
  ]), [isEditing])

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <NovaOrdemServicoForm
        onSuccess={() => navigate('/ordens-servico')}
        ordemServicoId={isEditing ? ordemServicoId : undefined}
      />

      <div className="space-y-4">
        {sideNotes.map((note) => {
          const Icon = note.icon
          return (
            <Card key={note.title}>
              <div className="flex items-center gap-3">
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${note.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">{note.title}</h3>
                  <p className="text-sm text-slate-500">Orientação operacional para atendimento de balcão.</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{note.description}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}