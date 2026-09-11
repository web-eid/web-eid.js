import { ActionDispatch, createContext } from 'react'
import { initialState, State } from '../state/reducer'
import { Action } from '../state/actions'

type AppContextType = {
  state: State
  dispatch: ActionDispatch<[action: Action]>
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
})
