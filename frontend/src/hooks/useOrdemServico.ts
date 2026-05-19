import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ordemServicoService } from '../services/ordemServicoService'
import type {
  OrdemServicoFilters,
  OrdemServicoPayload,
  OrdemServicoStatus,
} from '../types/ordem-servico'
import { getApiErrorMessage } from '../utils/api'

interface UpdateStatusInput {
  id: number
  status: OrdemServicoStatus
  version: number
}

export function useOrdemServico(filters: OrdemServicoFilters = {}) {
  const queryClient = useQueryClient()

  const ordensQuery = useQuery({
    queryKey: ['ordens-servico', filters],
    queryFn: () => ordemServicoService.list(filters),
  })

  const createMutation = useMutation({
    mutationFn: (payload: OrdemServicoPayload) => ordemServicoService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ordens-servico'] })
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: (payload: UpdateStatusInput) => ordemServicoService.updateStatus(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ordens-servico'] })
    },
  })

  return {
    ordensQuery,
    createMutation,
    updateStatusMutation,
    errorMessage: getApiErrorMessage(
      ordensQuery.error ?? createMutation.error ?? updateStatusMutation.error,
    ),
  }
}
