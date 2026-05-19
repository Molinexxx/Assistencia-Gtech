import { AlertTriangle, ArrowDownToLine, Box, PackagePlus, Search, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { useEstoque } from '../hooks/useEstoque'
import type { EstoqueCategoria, EstoquePecaResponse } from '../types/estoque'
import { formatCurrency } from '../utils/format'

const categories: Array<{ label: string; value: EstoqueCategoria | 'ALL' }> = [
  { label: 'Todos', value: 'ALL' },
  { label: 'Pecas', value: 'PECAS' },
  { label: 'Acessorios', value: 'ACESSORIOS' },
  { label: 'Ferramentas', value: 'FERRAMENTAS' },
]

function inferCategoria(item: EstoquePecaResponse): EstoqueCategoria {
  const source = `${item.sku} ${item.nome} ${item.descricao ?? ''}`.toLowerCase()
  if (/(cabo|capa|pelicula|carregador|fone|adaptador)/.test(source)) return 'ACESSORIOS'
  if (/(chave|pinca|ferramenta|estacao|sugador|espatula)/.test(source)) return 'FERRAMENTAS'
  return 'PECAS'
}

function getStockTone(item: EstoquePecaResponse) {
  if (item.quantidadeAtual <= 0 || item.quantidadeAtual <= item.estoqueMinimo * 0.5) return 'critical'
  if (item.quantidadeAtual <= item.estoqueMinimo) return 'warning'
  return 'healthy'
}

export function EstoquePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<EstoqueCategoria | 'ALL'>('ALL')
  const [entryModalOpen, setEntryModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<EstoquePecaResponse | null>(null)
  const [novoItem, setNovoItem] = useState({ sku: '', nome: '', descricao: '', unidadeMedida: 'UN', custoMedio: '0', precoVenda: '0', quantidadeAtual: '1', estoqueMinimo: '1' })
  const [entryQuantity, setEntryQuantity] = useState('1')
  const [entryObservation, setEntryObservation] = useState('Reposicao de balcao')
  const { adjustMutation, alertasQuery, createMutation, errorMessage, estoqueQuery } = useEstoque(search)

  const estoque = useMemo(() => (estoqueQuery.data ?? []).filter((item) => (category === 'ALL' ? true : inferCategoria(item) === category)), [category, estoqueQuery.data])
  const criticalCount = useMemo(() => (estoqueQuery.data ?? []).filter((item) => getStockTone(item) === 'critical').length, [estoqueQuery.data])
  const warningCount = useMemo(() => (estoqueQuery.data ?? []).filter((item) => getStockTone(item) === 'warning').length, [estoqueQuery.data])

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      sku: novoItem.sku,
      nome: novoItem.nome,
      descricao: novoItem.descricao,
      unidadeMedida: novoItem.unidadeMedida,
      custoMedio: Number(novoItem.custoMedio),
      precoVenda: Number(novoItem.precoVenda),
      quantidadeAtual: Number(novoItem.quantidadeAtual),
      estoqueMinimo: Number(novoItem.estoqueMinimo),
      ativo: true,
    })
    setNovoItem({ sku: '', nome: '', descricao: '', unidadeMedida: 'UN', custoMedio: '0', precoVenda: '0', quantidadeAtual: '1', estoqueMinimo: '1' })
    setEntryModalOpen(false)
  }

  const handleQuickEntry = async () => {
    if (!selectedItem) return
    await adjustMutation.mutateAsync({
      id: selectedItem.id,
      payload: { tipoMovimento: 'ENTRADA', quantidade: Number(entryQuantity), observacao: entryObservation, version: selectedItem.version },
    })
    setSelectedItem(null)
    setEntryQuantity('1')
    setEntryObservation('Reposicao de balcao')
  }

  return (
    <div className="space-y-4">
      <Card className="border-[#001F3F]/10 bg-[linear-gradient(135deg,#001F3F_0%,#0B2342_65%,#101828_100%)] text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-300">Modulo de estoque</p>
            <h2 className="mt-3 text-3xl font-semibold">Controle premium com leitura rapida de risco</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Azul marinho para acao, grafite para densidade e alertas semanticos para destacar itens criticos.</p>
          </div>
          <Button className="bg-white text-[#001F3F] hover:bg-slate-100" onClick={() => setEntryModalOpen(true)}>
            <PackagePlus className="mr-2 h-4 w-4" />
            Entrada de mercadoria
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_220px_220px_220px]">
        <Card>
          <Input icon={Search} label="Busca inteligente" placeholder="SKU, peca, acessorio ou ferramenta" value={search} onChange={(event) => setSearch(event.target.value)} />
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button key={item.value} className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === item.value ? 'bg-[#001F3F] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`} onClick={() => setCategory(item.value)} type="button">{item.label}</button>
            ))}
          </div>
        </Card>
        <Card><p className="text-sm text-slate-500">Itens monitorados</p><p className="mt-3 text-3xl font-semibold text-slate-950">{estoqueQuery.data?.length ?? 0}</p></Card>
        <Card className="border-amber-200 bg-amber-50"><p className="text-sm text-amber-700">Atencao</p><p className="mt-3 text-3xl font-semibold text-amber-950">{warningCount}</p></Card>
        <Card className="border-rose-200 bg-rose-50"><p className="text-sm text-rose-700">Critico</p><p className="mt-3 text-3xl font-semibold text-rose-950">{criticalCount}</p></Card>
      </div>

      {estoqueQuery.isError || alertasQuery.isError || createMutation.isError || adjustMutation.isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Tabela de alta densidade</h3>
            <p className="text-sm text-slate-500">Filtros rapidos com destaque semantico para estoque minimo.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            {alertasQuery.data?.length ?? 0} alerta(s) de minimo
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="gtech-stock-table min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-white text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Item</th>
                <th className="px-5 py-4 font-semibold">Categoria</th>
                <th className="px-5 py-4 font-semibold">Saldo</th>
                <th className="px-5 py-4 font-semibold">Minimo</th>
                <th className="px-5 py-4 font-semibold">Custo</th>
                <th className="px-5 py-4 font-semibold">Venda</th>
                <th className="px-5 py-4 font-semibold">Acao rapida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">              {estoque.map((item) => {
                const tone = getStockTone(item)
                const toneClasses = tone === 'critical' ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-200' : tone === 'warning' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                return (
                  <tr key={item.id} className={`transition hover:bg-slate-50/80 ${tone === 'critical' ? 'gtech-stock-row-critical' : tone === 'warning' ? 'gtech-stock-row-warning' : ''}`}>
                    <td className="px-5 py-4"><div className="font-semibold text-slate-950">{item.nome}</div><div className="mt-1 text-xs text-slate-500">{item.sku} - {item.descricao ?? 'Sem descricao'}</div></td>
                    <td className="px-5 py-4">{inferCategoria(item)}</td>
                    <td className="px-5 py-4"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneClasses}`}>{item.quantidadeAtual} {item.unidadeMedida}</span></td>
                    <td className="px-5 py-4">{item.estoqueMinimo} {item.unidadeMedida}</td>
                    <td className="px-5 py-4">{formatCurrency(item.custoMedio)}</td>
                    <td className="px-5 py-4">{formatCurrency(item.precoVenda)}</td>
                    <td className="px-5 py-4"><Button variant="secondary" onClick={() => setSelectedItem(item)}><ArrowDownToLine className="mr-2 h-4 w-4" />Registrar entrada</Button></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {estoque.length === 0 ? <div className="px-5 py-8 text-sm text-slate-500">Nenhum item encontrado para os filtros atuais.</div> : null}
        </div>
      </Card>

      <Modal open={entryModalOpen} onClose={() => setEntryModalOpen(false)} title="Entrada de mercadoria" description="Cadastre rapidamente uma nova peca, acessorio ou ferramenta no estoque.">
        <div className="grid gap-4 md:grid-cols-2">
          <Input autoFocus label="SKU" value={novoItem.sku} onChange={(event) => setNovoItem((state) => ({ ...state, sku: event.target.value }))} />
          <Input label="Nome do item" value={novoItem.nome} onChange={(event) => setNovoItem((state) => ({ ...state, nome: event.target.value }))} />
          <Input label="Descricao" value={novoItem.descricao} onChange={(event) => setNovoItem((state) => ({ ...state, descricao: event.target.value }))} />
          <Input label="Unidade" value={novoItem.unidadeMedida} onChange={(event) => setNovoItem((state) => ({ ...state, unidadeMedida: event.target.value }))} />
          <Input label="Custo medio" type="number" value={novoItem.custoMedio} onChange={(event) => setNovoItem((state) => ({ ...state, custoMedio: event.target.value }))} />
          <Input label="Preco de venda" type="number" value={novoItem.precoVenda} onChange={(event) => setNovoItem((state) => ({ ...state, precoVenda: event.target.value }))} />
          <Input label="Quantidade inicial" type="number" value={novoItem.quantidadeAtual} onChange={(event) => setNovoItem((state) => ({ ...state, quantidadeAtual: event.target.value }))} />
          <Input label="Estoque minimo" type="number" value={novoItem.estoqueMinimo} onChange={(event) => setNovoItem((state) => ({ ...state, estoqueMinimo: event.target.value }))} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setEntryModalOpen(false)}>Cancelar</Button>
          <Button onClick={() => void handleCreate()} disabled={createMutation.isPending}><PackagePlus className="mr-2 h-4 w-4" />{createMutation.isPending ? 'Salvando...' : 'Salvar item'}</Button>
        </div>
      </Modal>

      <Modal open={Boolean(selectedItem)} onClose={() => setSelectedItem(null)} title="Entrada rapida" description={selectedItem ? `Registrar reposicao para ${selectedItem.nome}.` : undefined} className="max-w-xl">
        <div className="grid gap-4">
          <Card className="border-[#001F3F]/10 bg-slate-50 shadow-none">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#001F3F] text-white">{selectedItem && inferCategoria(selectedItem) === 'FERRAMENTAS' ? <Wrench className="h-5 w-5" /> : <Box className="h-5 w-5" />}</span>
              <div>
                <p className="text-sm text-slate-500">Saldo atual</p>
                <p className="text-xl font-semibold text-slate-950">{selectedItem?.quantidadeAtual} {selectedItem?.unidadeMedida}</p>
              </div>
            </div>
          </Card>
          <Input autoFocus label="Quantidade de entrada" type="number" value={entryQuantity} onChange={(event) => setEntryQuantity(event.target.value)} />
          <Input label="Observacao" value={entryObservation} onChange={(event) => setEntryObservation(event.target.value)} />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setSelectedItem(null)}>Cancelar</Button>
          <Button onClick={() => void handleQuickEntry()} disabled={adjustMutation.isPending || !selectedItem}><ArrowDownToLine className="mr-2 h-4 w-4" />{adjustMutation.isPending ? 'Registrando...' : 'Confirmar entrada'}</Button>
        </div>
      </Modal>
    </div>
  )
}
