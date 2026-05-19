import { apiClient } from './apiClient'
import type { TecnicoOption } from '../types/usuario'

export const usuarioService = {
  async listTecnicos() {
    const { data } = await apiClient.get<TecnicoOption[]>('/usuarios/tecnicos')
    return data
  },
}