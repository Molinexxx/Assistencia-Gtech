export type EstoqueCategoria = 'PECAS' | 'ACESSORIOS' | 'FERRAMENTAS'
export type TipoMovimentoEstoque = 'ENTRADA' | 'SAIDA' | 'AJUSTE_POSITIVO' | 'AJUSTE_NEGATIVO' | 'RESERVA' | 'ESTORNO'

export interface MovimentacaoEstoqueResponse {
  id: number
  tipoMovimento: TipoMovimentoEstoque
  quantidade: number
  saldoAnterior: number
  saldoPosterior: number
  observacao: string | null
  dataMovimento: string
  usuarioNome: string
}

export interface HistoricoEstoqueResponse {
  movimentacoes: MovimentacaoEstoqueResponse[]
  pagina: number
  totalPaginas: number
  totalElementos: number
}

export interface EstoquePecaResponse {
  id: number
  sku: string
  nome: string
  categoria: EstoqueCategoria
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
  categoria: EstoqueCategoria
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
