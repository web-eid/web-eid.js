import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ActionType } from '../state/actions'

export function useApi() {
  const { dispatch } = useContext(AppContext)
  
  async function apiFetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const response = await fetch(input, init)
  
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
