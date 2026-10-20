import { apiClient } from './apiClient'
import type { AjusteEstoquePayload, EstoquePecaPayload, EstoquePecaResponse, HistoricoEstoqueResponse } from '../types/estoque'

export const estoqueService = {
  async history(id: number, pagina = 0) {
    const { data } = await apiClient.get<HistoricoEstoqueResponse>(`/estoque/pecas/${id}/movimentacoes`, {
      params: { pagina },
    })
    return data
  },

  async list(busca = '') {
    const { data } = await apiClient.get<EstoquePecaResponse[]>('/estoque/pecas', {
      params: busca.trim() ? { busca: busca.trim() } : undefined,
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

  async update(id: number, payload: EstoquePecaPayload) {
    const { data } = await apiClient.put<EstoquePecaResponse>(`/estoque/pecas/${id}`, payload)
    return data
  },

  async adjust(id: number, payload: AjusteEstoquePayload) {
    const { data } = await apiClient.post<EstoquePecaResponse>(`/estoque/pecas/${id}/ajustes`, payload)
    return data
  },
}
