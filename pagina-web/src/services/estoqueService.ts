import { apiClient } from './apiClient'
import type { AjusteEstoquePayload, EstoquePecaPayload, EstoquePecaResponse } from '../types/estoque'

export const estoqueService = {
  async list(nome = '') {
    const { data } = await apiClient.get<EstoquePecaResponse[]>('/estoque/pecas', {
      params: nome ? { nome } : undefined,
    })

    return data
  },

  async listAlerts() {
    const { data } = await apiClient.get<EstoquePecaResponse[]>('/estoque/alertas/minimo')
    return data
  },

  async create(payload: EstoquePecaPayload) {
    const { data } = await apiClient.post<EstoquePecaResponse>('/estoque/pecas', payload)
    return data
  },

  async adjust(id: number, payload: AjusteEstoquePayload) {
    const { data } = await apiClient.post<EstoquePecaResponse>(`/estoque/pecas/${id}/ajustes`, payload)
    return data
  },
}