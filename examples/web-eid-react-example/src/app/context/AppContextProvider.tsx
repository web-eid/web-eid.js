import { useReducer } from 'react'
import { AppContext } from './AppContext'
import { initialState, reducer } from '../state/reducer'
import { useAuth } from '../hooks/useAuth'
import { useCallOnce } from '../hooks/useCallOnce'

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { checkAuth } = useAuth()

  useCallOnce(() => { checkAuth(dispatch) })
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
