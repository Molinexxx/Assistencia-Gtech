export interface ApiErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  details: string[]
}

export interface SelectOption {
  label: string
  value: string
}
