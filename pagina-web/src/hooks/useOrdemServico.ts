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

interface UseOrdemServicoOptions {
  listEnabled?: boolean
}

export function useOrdemServico(
  filters: OrdemServicoFilters = {},
  ordemId?: number,
  options: UseOrdemServicoOptions = {},
) {
  const { listEnabled = true } = options
  const queryClient = useQueryClient()

  const ordensQuery = useQuery({
    enabled: listEnabled,
    queryKey: ['ordens-servico', filters],
    queryFn: () => ordemServicoService.list(filters),
  })

  const ordemDetalheQuery = useQuery({
    enabled: typeof ordemId === 'number',
    queryKey: ['ordem-servico', ordemId],
    queryFn: () => ordemServicoService.getById(ordemId as number),
  })

  const createMutation = useMutation({
    mutationFn: (payload: OrdemServicoPayload) => ordemServicoService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['ordens-servico'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: OrdemServicoPayload }) => ordemServicoService.update(id, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['ordens-servico'] })
      void queryClient.invalidateQueries({ queryKey: ['ordem-servico', variables.id] })
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
    ordemDetalheQuery,
    createMutation,
    updateMutation,
    updateStatusMutation,
    errorMessage: getApiErrorMessage(
      ordensQuery.error
      ?? ordemDetalheQuery.error
      ?? createMutation.error
      ?? updateMutation.error
      ?? updateStatusMutation.error,
    ),
  }
}