import axios from 'axios'

import type { ApiErrorResponse } from '../types/api'

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const data = error.response?.data

    if (data?.details?.length) {
      return data.details.join(' | ')
    }

    if (data?.message) {
      return data.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Nao foi possivel concluir a operacao.'
}
