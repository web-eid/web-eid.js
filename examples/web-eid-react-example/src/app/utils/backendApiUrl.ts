import { config } from '../config'

export function backendApiUrl(input: RequestInfo | URL): RequestInfo | URL {
  if (!config.backendApiUrl || typeof input !== 'string' || !input.startsWith('/')) {
    return input
  }

  return `${config.backendApiUrl}${input}`
}
