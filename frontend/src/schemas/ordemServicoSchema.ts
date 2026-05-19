import { z } from 'zod'

const optionalText = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().optional(),
)

const optionalNumber = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : parsed
}, z.number().positive().optional())

const optionalInteger = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? value : parsed
}, z.number().int().positive().optional())

const optionalEmail = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().email('Informe um e-mail valido').optional(),
)

const itemSchema = z.object({
  estoquePecaId: optionalInteger,
  descricao: optionalText,
  quantidade: optionalNumber,
  valorUnitario: optionalNumber,
})

export const ordemServicoSchema = z.object({
  cliente: z.object({
    nome: z.string().trim().min(3, 'Informe o nome completo do cliente'),
    cpfCnpj: z.string().trim().min(11, 'Informe CPF ou CNPJ valido'),
    email: optionalEmail,
    telefone: z.string().trim().min(10, 'Informe telefone ou WhatsApp'),
    logradouro: optionalText,
    numero: optionalText,
    bairro: optionalText,
    cidade: optionalText,
    uf: z.preprocess(
      (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
      z.string().trim().length(2, 'UF deve ter 2 caracteres').optional(),
    ),
    cep: optionalText,
  }),
  aparelho: z.object({
    marca: z.string().trim().min(2, 'Informe a marca do aparelho'),
    modelo: z.string().trim().min(2, 'Informe o modelo do aparelho'),
    cor: optionalText,
    imei: z.string().trim().min(8, 'Informe o IMEI do aparelho'),
    numeroSerie: optionalText,
    bloqueioConta: z.boolean(),
    bloqueioFrp: z.boolean(),
    observacoes: optionalText,
  }),
  checklist: z.object({
    tela: z.string().trim().min(2, 'Informe o estado da tela'),
    carcaca: z.string().trim().min(2, 'Informe o estado da carcaca'),
    botoes: z.string().trim().min(2, 'Informe o estado dos botoes'),
    conectores: z.string().trim().min(2, 'Informe o estado dos conectores'),
    cameras: z.string().trim().min(2, 'Informe o estado das cameras'),
    biometria: z.string().trim().min(2, 'Informe o estado da biometria'),
    oxidacao: z.boolean(),
  }),
  acessoriosRecebidos: optionalText,
  problemaRelatado: z.string().trim().min(10, 'Descreva o defeito relatado'),
  imeiConfirmado: z.string().trim().min(8, 'Confirme o IMEI'),
  senhaDispositivo: optionalText,
  dataPrevisao: z.string().min(1, 'Informe a previsao').refine((value) => new Date(value) > new Date(), {
    message: 'A previsao precisa ser futura',
  }),
  tecnicoId: optionalInteger,
  itensPecas: z.array(itemSchema),
}).refine((values) => values.aparelho.imei.trim() === values.imeiConfirmado.trim(), {
  message: 'O IMEI confirmado deve ser igual ao IMEI do aparelho',
  path: ['imeiConfirmado'],
})

export type NovaOrdemServicoFormInput = z.input<typeof ordemServicoSchema>
export type NovaOrdemServicoFormData = z.output<typeof ordemServicoSchema>

export const ordemServicoDefaultValues: NovaOrdemServicoFormInput = {
  cliente: {
    nome: '',
    cpfCnpj: '',
    email: undefined,
    telefone: '',
    logradouro: undefined,
    numero: undefined,
    bairro: undefined,
    cidade: undefined,
    uf: undefined,
    cep: undefined,
  },
  aparelho: {
    marca: '',
    modelo: '',
    cor: undefined,
    imei: '',
    numeroSerie: undefined,
    bloqueioConta: false,
    bloqueioFrp: false,
    observacoes: undefined,
  },
  checklist: {
    tela: '',
    carcaca: '',
    botoes: '',
    conectores: '',
    cameras: '',
    biometria: '',
    oxidacao: false,
  },
  acessoriosRecebidos: undefined,
  problemaRelatado: '',
  imeiConfirmado: '',
  senhaDispositivo: undefined,
  dataPrevisao: '',
  tecnicoId: undefined,
  itensPecas: [],
}