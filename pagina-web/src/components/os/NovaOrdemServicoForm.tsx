import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { CalendarClock, LoaderCircle, MapPinned, Plus, Search, Trash2, UserRound } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFieldArray, useForm, useWatch, type Path } from 'react-hook-form'

import { deviceCatalog } from '../../data/deviceCatalog'
import { useOrdemServico } from '../../hooks/useOrdemServico'
import {
  ordemServicoDefaultValues,
  ordemServicoSchema,
  type NovaOrdemServicoFormData,
  type NovaOrdemServicoFormInput,
} from '../../schemas/ordemServicoSchema'
import { fetchAddressByCep, formatCep, sanitizeCep } from '../../services/cepService'
import { usuarioService } from '../../services/usuarioService'
import type { OrdemServicoPayload, OrdemServicoResponse } from '../../types/ordem-servico'
import { getApiErrorMessage } from '../../utils/api'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { SearchableSelect } from '../ui/SearchableSelect'
import { Textarea } from '../ui/Textarea'
import { PinPad } from './PinPad'

interface NovaOrdemServicoFormProps {
  onSuccess?: () => void
  ordemServicoId?: number
}

const steps = [
  { title: 'Cliente', description: 'Cadastre ou confirme o cliente com o minimo de digitacao possivel.' },
  { title: 'Aparelho e checklist', description: 'Escolha marca, modelo e documente o estado fisico com apoio visual.' },
  { title: 'Defeito e responsavel', description: 'Descreva o sintoma, vincule o tecnico e ajuste pecas previstas.' },
] as const

const stepFields: Array<Path<NovaOrdemServicoFormInput>[]> = [
  ['cliente.nome', 'cliente.cpfCnpj', 'cliente.telefone'],
  ['aparelho.marca', 'aparelho.modelo', 'aparelho.imei', 'checklist.tela', 'checklist.carcaca', 'checklist.botoes', 'checklist.conectores', 'checklist.cameras', 'checklist.biometria'],
  ['problemaRelatado', 'imeiConfirmado', 'dataPrevisao'],
]

const checklistOptions = [
  { label: 'Integro', value: 'integro' },
  { label: 'Com riscos', value: 'com_riscos' },
  { label: 'Trincado', value: 'trincado' },
  { label: 'Sem teste', value: 'sem_teste' },
] as const

function normalizeText(value?: string) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function toDateTimeLocal(value?: string | null) {
  if (!value) return ''
  return value.slice(0, 16)
}

function buildFallbackFutureDate() {
  const nextHour = new Date(Date.now() + 60 * 60 * 1000)
  return nextHour.toISOString().slice(0, 16)
}

function mapResponseToFormValues(ordem: OrdemServicoResponse): NovaOrdemServicoFormInput {
  return {
    cliente: {
      id: ordem.cliente?.id,
      nome: ordem.cliente?.nome ?? ordem.clienteNome,
      cpfCnpj: ordem.cliente?.cpfCnpj ?? ordem.clienteCpfCnpj ?? '',
      email: ordem.cliente?.email ?? undefined,
      telefone: ordem.cliente?.telefone ?? ordem.clienteTelefone ?? '',
      logradouro: ordem.cliente?.logradouro ?? undefined,
      numero: ordem.cliente?.numero ?? undefined,
      bairro: ordem.cliente?.bairro ?? undefined,
      cidade: ordem.cliente?.cidade ?? undefined,
      uf: ordem.cliente?.uf ?? undefined,
      cep: ordem.cliente?.cep ?? undefined,
    },
    aparelho: {
      marca: ordem.aparelho?.marca ?? '',
      modelo: ordem.aparelho?.modelo ?? '',
      cor: ordem.aparelho?.cor ?? undefined,
      imei: ordem.aparelho?.imei ?? ordem.imeiConfirmado,
      numeroSerie: ordem.aparelho?.numeroSerie ?? undefined,
      bloqueioConta: ordem.aparelho?.bloqueioConta ?? false,
      bloqueioFrp: ordem.aparelho?.bloqueioFrp ?? false,
      observacoes: ordem.aparelho?.observacoes ?? undefined,
    },
    checklist: {
      tela: ordem.checklist?.tela ?? '',
      carcaca: ordem.checklist?.carcaca ?? '',
      botoes: ordem.checklist?.botoes ?? '',
      conectores: ordem.checklist?.conectores ?? '',
      cameras: ordem.checklist?.cameras ?? '',
      biometria: ordem.checklist?.biometria ?? '',
      oxidacao: ordem.checklist?.oxidacao ?? false,
    },
    acessoriosRecebidos: ordem.acessoriosRecebidos ?? undefined,
    problemaRelatado: ordem.problemaRelatado ?? '',
    imeiConfirmado: ordem.imeiConfirmado,
    senhaDispositivo: ordem.senhaDispositivo ?? undefined,
    dataPrevisao: toDateTimeLocal(ordem.dataPrevisao) || buildFallbackFutureDate(),
    tecnicoId: ordem.tecnicoId ?? undefined,
    version: ordem.version,
    itensPecas: ordem.itens.map((item) => ({ estoquePecaId: item.estoquePecaId ?? undefined, descricao: item.descricao, quantidade: item.quantidade, valorUnitario: item.valorUnitario })),
  }
}
function toPayload(values: NovaOrdemServicoFormData): OrdemServicoPayload {
  return {
    cliente: {
      ...(values.cliente.id ? { id: values.cliente.id } : {}),
      nome: values.cliente.nome.trim(),
      cpfCnpj: values.cliente.cpfCnpj.trim(),
      telefone: values.cliente.telefone.trim(),
      ...(normalizeText(values.cliente.email) ? { email: normalizeText(values.cliente.email) } : {}),
      ...(normalizeText(values.cliente.logradouro) ? { logradouro: normalizeText(values.cliente.logradouro) } : {}),
      ...(normalizeText(values.cliente.numero) ? { numero: normalizeText(values.cliente.numero) } : {}),
      ...(normalizeText(values.cliente.bairro) ? { bairro: normalizeText(values.cliente.bairro) } : {}),
      ...(normalizeText(values.cliente.cidade) ? { cidade: normalizeText(values.cliente.cidade) } : {}),
      ...(normalizeText(values.cliente.uf) ? { uf: values.cliente.uf?.trim().toUpperCase() } : {}),
      ...(normalizeText(values.cliente.cep) ? { cep: normalizeText(values.cliente.cep) } : {}),
    },
    aparelho: {
      marca: values.aparelho.marca.trim(),
      modelo: values.aparelho.modelo.trim(),
      imei: values.aparelho.imei.trim(),
      bloqueioConta: values.aparelho.bloqueioConta,
      bloqueioFrp: values.aparelho.bloqueioFrp,
      ...(normalizeText(values.aparelho.cor) ? { cor: normalizeText(values.aparelho.cor) } : {}),
      ...(normalizeText(values.aparelho.numeroSerie) ? { numeroSerie: normalizeText(values.aparelho.numeroSerie) } : {}),
      ...(normalizeText(values.aparelho.observacoes) ? { observacoes: normalizeText(values.aparelho.observacoes) } : {}),
    },
    checklist: values.checklist,
    ...(normalizeText(values.acessoriosRecebidos) ? { acessoriosRecebidos: normalizeText(values.acessoriosRecebidos) } : {}),
    problemaRelatado: values.problemaRelatado.trim(),
    imeiConfirmado: values.imeiConfirmado.trim(),
    ...(normalizeText(values.senhaDispositivo) ? { senhaDispositivo: normalizeText(values.senhaDispositivo) } : {}),
    dataPrevisao: values.dataPrevisao.length === 16 ? `${values.dataPrevisao}:00` : values.dataPrevisao,
    ...(values.tecnicoId ? { tecnicoId: values.tecnicoId } : {}),
    ...(values.version ? { version: values.version } : {}),
    itensPecas: values.itensPecas.filter((item) => item.descricao || item.estoquePecaId || item.quantidade || item.valorUnitario).map((item) => ({
      ...(item.estoquePecaId ? { estoquePecaId: item.estoquePecaId } : {}),
      ...(normalizeText(item.descricao) ? { descricao: normalizeText(item.descricao) } : {}),
      ...(item.quantidade ? { quantidade: item.quantidade } : {}),
      ...(item.valorUnitario ? { valorUnitario: item.valorUnitario } : {}),
    })),
  }
}

export function NovaOrdemServicoForm({ onSuccess, ordemServicoId }: NovaOrdemServicoFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [cepErrorMessage, setCepErrorMessage] = useState('')
  const [isLookingUpCep, setIsLookingUpCep] = useState(false)
  const { createMutation, errorMessage, ordemDetalheQuery, updateMutation } = useOrdemServico({}, ordemServicoId, { listEnabled: false })
  const lastFetchedCepRef = useRef<string>('')

  const { control, formState: { errors }, handleSubmit, register, reset, setValue, trigger } = useForm<NovaOrdemServicoFormInput, unknown, NovaOrdemServicoFormData>({
    defaultValues: ordemServicoDefaultValues,
    resolver: zodResolver(ordemServicoSchema),
  })

  const watchedCep = String(useWatch({ control, name: 'cliente.cep' }) ?? '')
  const watchedBrand = String(useWatch({ control, name: 'aparelho.marca' }) ?? '')
  const watchedPin = String(useWatch({ control, name: 'senhaDispositivo' }) ?? '')
  const watchedModel = String(useWatch({ control, name: 'aparelho.modelo' }) ?? '')
  const watchedTecnicoId = String(useWatch({ control, name: 'tecnicoId' }) ?? '')
  const cepField = register('cliente.cep', { onChange: () => setCepErrorMessage('') })
  const { append, fields, remove } = useFieldArray({ control, name: 'itensPecas' })

  const tecnicosQuery = useQuery({ queryKey: ['tecnicos'], queryFn: () => usuarioService.listTecnicos() })
  const currentStepMeta = steps[currentStep]
  const isEditing = typeof ordemServicoId === 'number'
  const mutationIsPending = createMutation.isPending || updateMutation.isPending

  const brandOptions = useMemo(() => deviceCatalog.map((item) => ({ value: item.brand, label: item.brand, helper: `${item.models.length} modelos mais usados`, keywords: item.models })), [])
  const modelOptions = useMemo(() => {
    const selectedBrand = deviceCatalog.find((item) => item.brand === watchedBrand)
    return (selectedBrand?.models ?? []).map((model) => ({ value: model, label: model, helper: watchedBrand }))
  }, [watchedBrand])
  const technicianOptions = useMemo(() => ([
    { value: '', label: 'Definir depois', helper: 'Mantem a OS sem tecnico alocado no momento.' },
    ...((tecnicosQuery.data ?? []).map((tecnico) => ({ value: String(tecnico.id), label: tecnico.nome, helper: tecnico.username }))),
  ]), [tecnicosQuery.data])

  useEffect(() => {
    if (!ordemDetalheQuery.data) return
    reset(mapResponseToFormValues(ordemDetalheQuery.data))
  }, [ordemDetalheQuery.data, reset])

  useEffect(() => {
    const sanitizedCep = sanitizeCep(watchedCep)
    if (!watchedCep) { lastFetchedCepRef.current = ''; return }
    if (formatCep(watchedCep) !== watchedCep) { setValue('cliente.cep', formatCep(watchedCep), { shouldDirty: true }); return }
    if (sanitizedCep.length !== 8 || sanitizedCep === lastFetchedCepRef.current) return
    let isMounted = true
    setIsLookingUpCep(true)
    void fetchAddressByCep(sanitizedCep).then((address) => {
      if (!isMounted) return
      lastFetchedCepRef.current = sanitizedCep
      setValue('cliente.cep', address.cep, { shouldDirty: true })
      setValue('cliente.logradouro', address.logradouro, { shouldDirty: true, shouldValidate: true })
      setValue('cliente.bairro', address.bairro, { shouldDirty: true, shouldValidate: true })
      setValue('cliente.cidade', address.cidade, { shouldDirty: true, shouldValidate: true })
      setValue('cliente.uf', address.uf, { shouldDirty: true, shouldValidate: true })
    }).catch((error: unknown) => {
      if (!isMounted) return
      lastFetchedCepRef.current = ''
      setCepErrorMessage(getApiErrorMessage(error))
    }).finally(() => { if (isMounted) setIsLookingUpCep(false) })
    return () => { isMounted = false }
  }, [setValue, watchedCep])

  async function handleNextStep() {
    const isStepValid = await trigger(stepFields[currentStep], { shouldFocus: true })
    if (isStepValid) setCurrentStep((step) => Math.min(step + 1, steps.length - 1))
  }

  async function onSubmit(values: NovaOrdemServicoFormData) {
    const payload = toPayload(values)
    const response = isEditing && ordemServicoId ? await updateMutation.mutateAsync({ id: ordemServicoId, payload }) : await createMutation.mutateAsync(payload)
    setSuccessMessage(isEditing ? `OS ${response.codigo} atualizada com sucesso.` : `OS ${response.codigo} criada com sucesso.`)
    setCepErrorMessage('')
    lastFetchedCepRef.current = ''
    reset(isEditing ? mapResponseToFormValues(response) : ordemServicoDefaultValues)
    setCurrentStep(0)
    onSuccess?.()
  }

  if (isEditing && ordemDetalheQuery.isLoading) return <Card className="text-sm text-slate-500">Carregando dados da OS para edicao...</Card>

  return (
    <form className="space-y-6" onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{isEditing ? 'Modo de edicao' : 'Formulario em etapas'}</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">{currentStepMeta.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{currentStepMeta.description}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => <div key={step.title} className={`rounded-2xl border p-4 ${index === currentStep ? 'border-[#001F3F] bg-[#001F3F] text-white' : 'border-slate-200 bg-slate-50 text-slate-500'}`}><span className="text-xs font-semibold uppercase tracking-[0.24em]">Etapa {index + 1}</span><p className="mt-2 text-sm font-medium">{step.title}</p></div>)}
          </div>
        </div>
      </Card>

      {currentStep === 0 ? (
        <Card className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input autoFocus={!isEditing} label="Nome do cliente" placeholder="Nome completo" {...register('cliente.nome')} error={errors.cliente?.nome?.message} />
            <Input label="CPF ou CNPJ" placeholder="Somente numeros ou formatado" {...register('cliente.cpfCnpj')} error={errors.cliente?.cpfCnpj?.message} />
            <Input label="Telefone / WhatsApp" placeholder="(11) 99999-9999" {...register('cliente.telefone')} error={errors.cliente?.telefone?.message} />
            <Input label="E-mail" placeholder="Opcional" {...register('cliente.email')} error={errors.cliente?.email?.message} />
            <Input label="CEP" icon={MapPinned} placeholder="00000-000" {...cepField} error={errors.cliente?.cep?.message} />
            <Input label="Numero" placeholder="Opcional" {...register('cliente.numero')} error={errors.cliente?.numero?.message} />
            <Input label="Logradouro" placeholder="Rua, avenida..." {...register('cliente.logradouro')} error={errors.cliente?.logradouro?.message} />
            <Input label="Bairro" placeholder="Preenchido pelo CEP" {...register('cliente.bairro')} error={errors.cliente?.bairro?.message} />
            <Input label="Cidade" placeholder="Preenchido pelo CEP" {...register('cliente.cidade')} error={errors.cliente?.cidade?.message} />
            <Input label="UF" maxLength={2} placeholder="SP" {...register('cliente.uf')} error={errors.cliente?.uf?.message} />
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              {isLookingUpCep ? <LoaderCircle className="h-4 w-4 animate-spin text-[#001F3F]" /> : <MapPinned className="h-4 w-4 text-[#001F3F]" />}
              <span>{isLookingUpCep ? 'Consultando CEP...' : 'Digite um CEP valido para preencher endereco, bairro, cidade e UF automaticamente.'}</span>
            </div>
            {cepErrorMessage ? <span className="font-medium text-rose-600">{cepErrorMessage}</span> : null}
          </div>
        </Card>
      ) : null}

      {currentStep === 1 ? (
        <Card className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_320px]">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
              <SearchableSelect autoFocus label="Marca" options={brandOptions} value={watchedBrand} onChange={(value) => { setValue('aparelho.marca', value, { shouldDirty: true, shouldValidate: true }); setValue('aparelho.modelo', '', { shouldDirty: true, shouldValidate: true }) }} error={errors.aparelho?.marca?.message} placeholder="Escolha a marca" searchPlaceholder="Buscar marca" />
              <SearchableSelect label="Modelo" options={modelOptions} value={watchedModel} onChange={(value) => setValue('aparelho.modelo', value, { shouldDirty: true, shouldValidate: true })} error={errors.aparelho?.modelo?.message} placeholder="Escolha o modelo" searchPlaceholder="Buscar modelo" />
              <Input label="Cor" placeholder="Opcional" {...register('aparelho.cor')} error={errors.aparelho?.cor?.message} />
              <Input label="IMEI" placeholder="Obrigatorio" {...register('aparelho.imei')} error={errors.aparelho?.imei?.message} />
              <Input label="Numero de serie" placeholder="Opcional" {...register('aparelho.numeroSerie')} error={errors.aparelho?.numeroSerie?.message} />
              <Input label="Acessorios recebidos" placeholder="Capa, carregador..." {...register('acessoriosRecebidos')} error={errors.acessoriosRecebidos?.message} />
              <Input label="Senha do dispositivo" placeholder="Preenchida pelo PIN pad" readOnly value={watchedPin} {...register('senhaDispositivo')} error={errors.senhaDispositivo?.message} />
            </div>
            <PinPad value={watchedPin} onChange={(value) => setValue('senhaDispositivo', value, { shouldDirty: true, shouldValidate: true })} disabled={mutationIsPending} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(['tela', 'carcaca', 'botoes', 'conectores', 'cameras', 'biometria'] as const).map((field) => (
              <Select key={field} label={field.charAt(0).toUpperCase() + field.slice(1)} {...register(`checklist.${field}`)} error={errors.checklist?.[field]?.message}>
                <option value="">Selecione</option>
                {checklistOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>
            ))}
          </div>
          <Textarea label="Observacoes do aparelho" placeholder="Detalhes visuais, tampa, parafusos, dano por queda..." {...register('aparelho.observacoes')} error={errors.aparelho?.observacoes?.message} />
          <div className="flex flex-wrap gap-6">
            <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('aparelho.bloqueioConta')} />Bloqueio de conta ativo</label>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('aparelho.bloqueioFrp')} />Bloqueio FRP ativo</label>
            <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" {...register('checklist.oxidacao')} />Indicio de oxidacao</label>
          </div>
        </Card>
      ) : null}

      {currentStep === 2 ? (
        <Card className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Input label="IMEI confirmado" placeholder="Repita o IMEI para validacao" {...register('imeiConfirmado')} error={errors.imeiConfirmado?.message} />
            <Input label="Previsao de entrega" icon={CalendarClock} type="datetime-local" {...register('dataPrevisao')} error={errors.dataPrevisao?.message} />
            <SearchableSelect label="Tecnico responsavel" options={technicianOptions} value={watchedTecnicoId} onChange={(value) => setValue('tecnicoId', value ? Number(value) : undefined, { shouldDirty: true, shouldValidate: true })} placeholder={tecnicosQuery.isLoading ? 'Carregando tecnicos...' : 'Selecionar tecnico'} searchPlaceholder="Buscar tecnico por nome" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <div className="flex items-center gap-2"><UserRound className="h-4 w-4 text-[#001F3F]" /><span>O campo de responsavel exibe o nome do tecnico com busca interna, sem expor IDs na operacao.</span></div>
          </div>
          <Textarea label="Defeito relatado" placeholder="Descreva exatamente o sintoma informado pelo cliente" {...register('problemaRelatado')} error={errors.problemaRelatado?.message} />
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 className="text-lg font-semibold text-slate-950">Pecas previstas</h4>
                <p className="mt-1 text-sm text-slate-500">Opcional na abertura. Use para reservar estoque ou estimar valores.</p>
              </div>
              <Button variant="secondary" onClick={() => append({ descricao: undefined, estoquePecaId: undefined, quantidade: undefined, valorUnitario: undefined })}><Plus className="mr-2 h-4 w-4" />Adicionar peca</Button>
            </div>
            {fields.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500">Nenhuma peca vinculada. O backend recebera a lista vazia corretamente.</div> : null}
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[120px_minmax(0,1fr)_120px_140px_auto]">
                <Input label="ID estoque" type="number" {...register(`itensPecas.${index}.estoquePecaId`)} error={errors.itensPecas?.[index]?.estoquePecaId?.message} />
                <Input label="Descricao" placeholder="Ex: Display OLED" {...register(`itensPecas.${index}.descricao`)} error={errors.itensPecas?.[index]?.descricao?.message} />
                <Input label="Quantidade" type="number" step="1" {...register(`itensPecas.${index}.quantidade`)} error={errors.itensPecas?.[index]?.quantidade?.message} />
                <Input label="Valor unitario" type="number" step="0.01" {...register(`itensPecas.${index}.valorUnitario`)} error={errors.itensPecas?.[index]?.valorUnitario?.message} />
                <div className="flex items-end"><Button variant="ghost" className="w-full justify-center" onClick={() => remove(index)}><Trash2 className="mr-2 h-4 w-4" />Remover</Button></div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {successMessage ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</div> : null}
      {createMutation.isError || updateMutation.isError || ordemDetalheQuery.isError ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</div> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))} disabled={currentStep === 0 || mutationIsPending}>Voltar etapa</Button>
        <div className="flex flex-col gap-3 sm:flex-row">
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNextStep} disabled={mutationIsPending}>
              <Search className="mr-2 h-4 w-4" />
              Proxima etapa
            </Button>
          ) : (
            <Button type="submit" disabled={mutationIsPending || isLookingUpCep}>
              {mutationIsPending ? (isEditing ? 'Atualizando OS...' : 'Salvando OS...') : (isEditing ? 'Salvar alteracoes da OS' : 'Criar ordem de servico')}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
