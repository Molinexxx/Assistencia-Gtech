import axios from 'axios'

import type { ApiErrorResponse } from '../types/api'

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data

    if (data?.details?.length) {
      return data.details.join(' | ')
    }

    if (data?.message) {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Nao foi possivel concluir a operacao.'
}

const estoqueFieldLabels: Record<string, string> = {
  sku: 'Código (SKU)',
  nome: 'Nome da peça',
  categoria: 'Categoria',
  descricao: 'Descrição',
  unidadeMedida: 'Unidade de medida',
  custoMedio: 'Custo médio',
  precoVenda: 'Preço de venda',
  quantidadeAtual: 'Quantidade inicial',
  estoqueMinimo: 'Estoque mínimo',
}

const requiredEstoqueMessages: Record<string, string> = {
  sku: 'Preencha o código (SKU) da peça.',
  nome: 'Preencha o nome da peça.',
  categoria: 'Escolha a categoria da peça.',
  unidadeMedida: 'Preencha a unidade de medida.',
  custoMedio: 'Preencha o custo médio.',
  precoVenda: 'Preencha o preço de venda.',
  quantidadeAtual: 'Preencha a quantidade inicial.',
  estoqueMinimo: 'Preencha o estoque mínimo.',
}

const nonNegativeEstoqueMessages: Record<string, string> = {
  custoMedio: 'O custo médio não pode ser negativo.',
  precoVenda: 'O preço de venda não pode ser negativo.',
  quantidadeAtual: 'A quantidade inicial não pode ser negativa.',
  estoqueMinimo: 'O estoque mínimo não pode ser negativo.',
}

export function getEstoqueCadastroErrorMessage(error: unknown) {
  if (!axios.isAxiosError<ApiErrorResponse>(error) || !error.response?.data?.details?.length) {
    const message = getApiErrorMessage(error)
    return message === 'Ja existe peca cadastrada com este SKU.'
      ? 'Já existe uma peça com esse código (SKU). Use outro código.'
      : message
  }

  return error.response.data.details.map((detail) => {
    const separator = detail.indexOf(':')
    if (separator < 0) return detail

    const field = detail.slice(0, separator).trim()
    const reason = detail.slice(separator + 1).trim()
    const normalizedReason = reason.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

    if (/branco|blank|nulo|null/.test(normalizedReason) && requiredEstoqueMessages[field]) {
      return requiredEstoqueMessages[field]
    }
    if (/maior.*igual.*0(?:[.,]0+)?$|greater.*equal.*0(?:[.,]0+)?$/.test(normalizedReason) && nonNegativeEstoqueMessages[field]) {
      return nonNegativeEstoqueMessages[field]
    }
    return `${estoqueFieldLabels[field] ?? field}: ${reason}`
  }).join(' ')
}
