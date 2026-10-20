import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, type FormEvent } from 'react'

import { estoqueService } from '../services/estoqueService'
import type { EstoqueCategoria, EstoquePecaPayload, EstoquePecaResponse } from '../types/estoque'
import { getEstoqueCadastroErrorMessage } from '../utils/api'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Modal } from './ui/Modal'
import { Select } from './ui/Select'

interface EditarPecaModalProps {
  item: EstoquePecaResponse
  onClose: () => void
  onSaved: (item: EstoquePecaResponse) => void
}

export function EditarPecaModal({ item, onClose, onSaved }: EditarPecaModalProps) {
  const queryClient = useQueryClient()
  const [values, setValues] = useState({
    nome: item.nome,
    categoria: item.categoria ?? 'PECAS',
    descricao: item.descricao ?? '',
    custoMedio: String(item.custoMedio),
    precoVenda: String(item.precoVenda),
    estoqueMinimo: String(item.estoqueMinimo),
  })
  const updateMutation = useMutation({
    mutationFn: (payload: EstoquePecaPayload) => estoqueService.update(item.id, payload),
    onSuccess: (savedItem) => {
      void queryClient.invalidateQueries({ queryKey: ['estoque'] })
      void queryClient.invalidateQueries({ queryKey: ['estoque-alertas'] })
      onSaved(savedItem)
    },
  })

  const close = () => {
    if (!updateMutation.isPending) onClose()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (updateMutation.isPending) return
    updateMutation.mutate({
      sku: item.sku,
      nome: values.nome.trim(),
      categoria: values.categoria,
      descricao: values.descricao.trim(),
      unidadeMedida: item.unidadeMedida,
      custoMedio: Number(values.custoMedio),
      precoVenda: Number(values.precoVenda),
      estoqueMinimo: Number(values.estoqueMinimo),
      quantidadeAtual: item.quantidadeAtual,
      ativo: item.ativo,
      version: item.version,
    })
  }

  return (
    <Modal open onClose={close} title="Editar peça" description={`Código (SKU): ${item.sku}`}>
      <form onSubmit={handleSubmit}>
        <p className="mb-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
          Saldo atual: <strong>{item.quantidadeAtual} {item.unidadeMedida}</strong>. Para alterar a quantidade, use Registrar entrada ou Registrar saída.
        </p>
        {updateMutation.isError ? <div role="alert" className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{getEstoqueCadastroErrorMessage(updateMutation.error)}</div> : null}
        <fieldset disabled={updateMutation.isPending} className="grid gap-4 md:grid-cols-2">
          <Input autoFocus required maxLength={160} label="Nome da peça" value={values.nome} onChange={(event) => setValues((current) => ({ ...current, nome: event.target.value }))} />
          <Input maxLength={500} label="Descrição" value={values.descricao} onChange={(event) => setValues((current) => ({ ...current, descricao: event.target.value }))} />
          <Select required label="Categoria" value={values.categoria} onChange={(event) => setValues((current) => ({ ...current, categoria: event.target.value as EstoqueCategoria }))}>
            <option value="PECAS">Peças</option>
            <option value="ACESSORIOS">Acessórios</option>
            <option value="FERRAMENTAS">Ferramentas</option>
          </Select>
          <Input required type="number" min="0" step="0.01" label="Custo médio" value={values.custoMedio} onChange={(event) => setValues((current) => ({ ...current, custoMedio: event.target.value }))} />
          <Input required type="number" min="0" step="0.01" label="Preço de venda" value={values.precoVenda} onChange={(event) => setValues((current) => ({ ...current, precoVenda: event.target.value }))} />
          <Input required type="number" min="0" step="0.001" label="Estoque mínimo" value={values.estoqueMinimo} onChange={(event) => setValues((current) => ({ ...current, estoqueMinimo: event.target.value }))} />
        </fieldset>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={close} disabled={updateMutation.isPending}>Cancelar</Button>
          <Button type="submit" disabled={updateMutation.isPending}>{updateMutation.isPending ? 'Salvando...' : 'Salvar alterações'}</Button>
        </div>
      </form>
    </Modal>
  )
}
