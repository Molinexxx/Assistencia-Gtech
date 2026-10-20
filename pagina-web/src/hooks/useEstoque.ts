import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { estoqueService } from '../services/estoqueService'
import type { AjusteEstoquePayload, EstoquePecaPayload } from '../types/estoque'
import { getApiErrorMessage } from '../utils/api'

export function useEstoque(search = '') {
  const queryClient = useQueryClient()

  const estoqueQuery = useQuery({
    queryKey: ['estoque', search],
    queryFn: () => estoqueService.list(search),
  })

  const alertasQuery = useQuery({
    queryKey: ['estoque-alertas'],
    queryFn: () => estoqueService.listAlerts(),
  })

  const createMutation = useMutation({
    mutationFn: (payload: EstoquePecaPayload) => estoqueService.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['estoque'] })
      void queryClient.invalidateQueries({ queryKey: ['estoque-alertas'] })
      void queryClient.invalidateQueries({ queryKey: ['estoque-historico'] })
    },
  })

  const adjustMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AjusteEstoquePayload }) => estoqueService.adjust(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['estoque'] })
      void queryClient.invalidateQueries({ queryKey: ['estoque-alertas'] })
      void queryClient.invalidateQueries({ queryKey: ['estoque-historico'] })
    },
  })

  return {
    estoqueQuery,
    alertasQuery,
    createMutation,
    adjustMutation,
    errorMessage: getApiErrorMessage(
      estoqueQuery.error ?? alertasQuery.error ?? createMutation.error ?? adjustMutation.error,
    ),
  }
}
