export const ordemServicoStatusList = [
  'EM_ANALISE',
  'AGUARDANDO_APROVACAO',
  'EM_REPARO',
  'AGUARDANDO_PECA',
  'FINALIZADA',
  'ENTREGUE',
  'CANCELADA',
] as const

export type OrdemServicoStatus = (typeof ordemServicoStatusList)[number]

export interface OrdemServicoFilters {
  status?: OrdemServicoStatus | ''
  clienteId?: number
  imei?: string
  codigo?: string
}

export interface OrdemServicoChecklist {
  tela: string
  carcaca: string
  botoes: string
  conectores: string
  cameras: string
  biometria: string
  oxidacao: boolean
}

export interface OrdemServicoClientePayload {
  id?: number
  nome: string
  cpfCnpj: string
  email?: string
  telefone: string
  logradouro?: string
  numero?: string
  bairro?: string
  cidade?: string
  uf?: string
  cep?: string
}

export interface OrdemServicoAparelhoPayload {
  marca: string
  modelo: string
  cor?: string
  imei: string
  numeroSerie?: string
  bloqueioConta: boolean
  bloqueioFrp: boolean
  observacoes?: string
}

export interface OrdemServicoItemPayload {
  estoquePecaId?: number
  descricao?: string
  quantidade?: number
  valorUnitario?: number
}

export interface OrdemServicoPayload {
  cliente: OrdemServicoClientePayload
  aparelho: OrdemServicoAparelhoPayload
  checklist: OrdemServicoChecklist
  acessoriosRecebidos?: string
  problemaRelatado: string
  imeiConfirmado: string
  senhaDispositivo?: string
  dataPrevisao: string
  tecnicoId?: number
  itensPecas: OrdemServicoItemPayload[]
}

export interface OrdemServicoItemResponse {
  id: number
  estoquePecaId?: number
  descricao: string
  quantidade: number
  valorUnitario: number
  subtotal: number
}

export interface OrdemServicoResponse {
  id: number
  codigo: string
  status: OrdemServicoStatus
  clienteId: number
  aparelhoId: number
  atendenteId: number
  tecnicoId?: number
  clienteNome: string
  aparelhoDescricao: string
  valorPecas: number
  valorMaoObra: number
  desconto: number
  valorTotal: number
  dataEntrada: string
  version: number
  itens: OrdemServicoItemResponse[]
}
