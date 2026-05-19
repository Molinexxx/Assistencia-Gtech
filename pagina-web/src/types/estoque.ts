export type EstoqueCategoria = 'PECAS' | 'ACESSORIOS' | 'FERRAMENTAS'
export type TipoMovimentoEstoque = 'ENTRADA' | 'SAIDA' | 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO' | 'RESERVA' | 'ESTORNO'

export interface EstoquePecaResponse {
  id: number
  sku: string
  nome: string
  descricao?: string | null
  unidadeMedida: string
  custoMedio: number
  precoVenda: number
  quantidadeAtual: number
  estoqueMinimo: number
  ativo: boolean
  version: number
}

export interface EstoquePecaPayload {
  sku: string
  nome: string
  descricao?: string
  unidadeMedida: string
  custoMedio: number
  precoVenda: number
  quantidadeAtual: number
  estoqueMinimo: number
  ativo: boolean
  version?: number
}

export interface AjusteEstoquePayload {
  tipoMovimento: TipoMovimentoEstoque
  quantidade: number
  observacao?: string
  version: number
}