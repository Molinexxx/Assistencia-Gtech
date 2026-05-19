import { FileText, MessageCircleMore, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { NovaOrdemServicoForm } from '../components/os/NovaOrdemServicoForm'
import { Card } from '../components/ui/Card'

export function NovaOrdemServicoPage() {
  const navigate = useNavigate()

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <NovaOrdemServicoForm onSuccess={() => navigate('/ordens-servico')} />

      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <MessageCircleMore className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">WhatsApp automatico</h3>
              <p className="text-sm text-slate-500">Use <code>wa.me</code> para fluxo simples ou API de mensageria para disparos oficiais.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">No frontend, voce pode abrir um link como <code>https://wa.me/5511999999999?text=Sua%20OS%20foi%20aberta</code> para mensagens assistidas. Em producao, o ideal e acionar o backend Java para enviar notificacoes assincronas via provider.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <FileText className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Comprovante em PDF</h3>
              <p className="text-sm text-slate-500">Prefira gerar no backend para padronizacao, auditoria e assinatura digital.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">O frontend pode usar <code>jsPDF</code> para rascunhos rapidos, mas o melhor caminho para comprovante oficial e renderizar no Spring Boot a partir de HTML/Thymeleaf ou engine dedicada e devolver o PDF pronto.</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Seguranca e perfis</h3>
              <p className="text-sm text-slate-500">A rota ja nasce protegida para <code>ADMIN</code> e <code>ATENDENTE</code>.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">Mesmo com protected routes no React, a validacao real deve permanecer no backend. O interceptor atual limpa a sessao em <code>401</code> e devolve o usuario para o login.</p>
        </Card>
      </div>
    </div>
  )
}
