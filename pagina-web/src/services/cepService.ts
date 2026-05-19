export interface CepLookupResult {
  bairro: string
  cep: string
  cidade: string
  logradouro: string
  uf: string
}

interface ViaCepResponse {
  bairro?: string
  cep?: string
  erro?: boolean
  localidade?: string
  logradouro?: string
  uf?: string
}

export function sanitizeCep(value?: string) {
  return (value ?? '').replace(/\D/g, '')
}

export function formatCep(value?: string) {
  const digits = sanitizeCep(value).slice(0, 8)

  if (digits.length <= 5) {
    return digits
  }

  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export async function fetchAddressByCep(cep: string) {
  const sanitizedCep = sanitizeCep(cep)

  if (sanitizedCep.length !== 8) {
    throw new Error('Informe um CEP com 8 digitos.')
  }

  const response = await fetch(`https://viacep.com.br/ws/${sanitizedCep}/json/`)

  if (!response.ok) {
    throw new Error('Nao foi possivel consultar o CEP agora.')
  }

  const data = (await response.json()) as ViaCepResponse

  if (data.erro) {
    throw new Error('CEP nao encontrado.')
  }

  return {
    bairro: data.bairro ?? '',
    cep: formatCep(data.cep ?? sanitizedCep),
    cidade: data.localidade ?? '',
    logradouro: data.logradouro ?? '',
    uf: data.uf ?? '',
  } satisfies CepLookupResult
}