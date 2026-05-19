import { apiClient } from './apiClient'
import type {
  OrdemServicoFilters,
  OrdemServicoPayload,
  OrdemServicoResponse,
  OrdemServicoStatus,
} from '../types/ordem-servico'

interface UpdateStatusPayload {
  id: number
  status: OrdemServicoStatus
  version: number
}

export const ordemServicoService = {
  async list(filters: OrdemServicoFilters = {}) {
    const { data } = await apiClient.get<OrdemServicoResponse[]>('/ordens-servico', {
      params: {
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.clienteId ? { clienteId: filters.clienteId } : {}),
        ...(filters.imei ? { imei: filters.imei } : {}),
        ...(filters.codigo ? { codigo: filters.codigo } : {}),
      },
    })

    return data
  },

  async getById(id: number) {
    const { data } = await apiClient.get<OrdemServicoResponse>(`/ordens-servico/${id}`)
    return data
  },

  async create(payload: OrdemServicoPayload) {
    const { data } = await apiClient.post<OrdemServicoResponse>('/ordens-servico', payload)
    return data
  },

  async update(id: number, payload: OrdemServicoPayload) {
    const { data } = await apiClient.put<OrdemServicoResponse>(`/ordens-servico/${id}`, payload)
    return data
  },

  async updateStatus({ id, status, version }: UpdateStatusPayload) {
    const { data } = await apiClient.put<OrdemServicoResponse>(`/ordens-servico/${id}/status`, {
      status,
      version,
    })

    return data
  },
}