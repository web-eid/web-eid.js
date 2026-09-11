import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ActionType } from '../state/actions'
import { backendApiUrl } from '../utils/backendApiUrl'
import { headersWithXsrfToken, shouldSendXsrfToken } from '../utils/xsrfTokenHeaders'

export function useApi() {
  const { dispatch } = useContext(AppContext)

  async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const method = init?.method ?? (input instanceof Request ? input.method : 'GET')

    const response = await fetch(backendApiUrl(input), {
      ...init,
      headers: shouldSendXsrfToken(method) ? headersWithXsrfToken(init?.headers) : init?.headers,
      credentials: 'include',
    })

    if (!response.ok) {
      if (response.status === 401) {
        dispatch({ type: ActionType.LOGOUT })
      }

      throw new Error(response.statusText)
    }

    return response.json() as T
  }

  return { apiFetch }
}
