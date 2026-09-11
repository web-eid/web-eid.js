const XSRF_COOKIE_NAME = 'XSRF-TOKEN'
const XSRF_HEADER_NAME = 'X-XSRF-TOKEN'
const XSRF_PROTECTED_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export function shouldSendXsrfToken(method: string): boolean {
  return XSRF_PROTECTED_METHODS.has(method.toUpperCase())
}

export function headersWithXsrfToken(headers?: HeadersInit): Headers {
  const requestHeaders = new Headers(headers)

  if (requestHeaders.has(XSRF_HEADER_NAME)) {
    return requestHeaders
  }

  const token = getCookie(document.cookie, XSRF_COOKIE_NAME)

  if (token) {
    requestHeaders.set(XSRF_HEADER_NAME, token)
  }

  return requestHeaders
}

function getCookie(cookies: string, name: string): string | null {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = cookies.match(new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`))

  if (!match) {
    return null
  }

  try {
    return decodeURIComponent(match[1])
  } catch {
    return match[1]
  }
}
