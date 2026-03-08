import { ActionDispatch, useContext } from 'react'
import * as webeid from '@web-eid/web-eid-library'

import { Action, ActionType } from '../state/actions'
import { State } from '../state/reducer'
import { AppContext } from '../context/AppContext'
import { useApi } from './useApi'

export function useAuth() {
  const { state, dispatch } = useContext(AppContext)
  const { apiFetch } = useApi()

  async function checkAuth(dispatch: ActionDispatch<[action: Action]>) {
    dispatch({ type: ActionType.CHECK_AUTH })

    try {
      const user = await apiFetch<State['auth']['user']>('/auth/user')

      if (!user?.sub) {
        throw new Error('Something went wrong')
      }

      dispatch({ type: ActionType.CHECK_AUTH_SUCCESS, payload: { user } })
    } catch (error) {
      dispatch({ type: ActionType.CHECK_AUTH_FAILURE, payload: { error } })
    }
  }

  async function loginWithIdCard() {
    dispatch({ type: ActionType.LOGIN })

    try {
      const { nonce } = await apiFetch<{ nonce: string }>('/auth/challenge')

      const authToken = await webeid.authenticate(nonce, { lang: state.language })

      const user = await apiFetch<State['auth']['user']>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'auth-token': authToken }),
      })

      if (!user?.sub) {
        throw new Error('Something went wrong')
      }

      dispatch({ type: ActionType.LOGIN_SUCCESS, payload: { user } })
    } catch (error) {
      dispatch({ type: ActionType.LOGIN_FAILURE, payload: { error } })
      throw error
    }
  }

  async function logout() {
    dispatch({ type: ActionType.LOGOUT })
  
    try {
      await apiFetch('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      dispatch({ type: ActionType.LOGOUT_SUCCESS })
    } catch (error) {
      dispatch({ type: ActionType.LOGOUT_FAILURE, payload: { error } })
      throw error
    }
  }

  return {
    checkAuth,
    loginWithIdCard,
    logout,
  }
}
