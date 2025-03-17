import { config } from '../config'
import { ActionType, Action } from './actions'

export interface State {
  language: string

  auth: {
    loggedIn: boolean | null
    user: { sub: string, auth: string } | null
    pending: boolean
    error: unknown
  }
  
  sign: {
    signedDocumentIds: string[]
    pending: boolean
    error: unknown
  }
}

export const initialState: State = {
  language: config.defaultLanguage,
  auth: {
    loggedIn: null,
    user: null,
    pending: false,
    error: null,
  },

  sign: {
    signedDocumentIds: [],
    pending: false,
    error: null,
  }
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.CHANGE_LANGUAGE:
      return {
        ...state,
        language: action.payload,
      }

    case ActionType.CHECK_AUTH:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: null,
          error: null,
          pending: true,
        },
      }

    case ActionType.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: true,
          user: action.payload.user,
          pending: false,
        },
      }

    case ActionType.CHECK_AUTH_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: false,
          pending: false,
          error: action.payload.error
        },
      }

    case ActionType.LOGIN:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: null,
          error: null,
          pending: true,
        },
      }

    case ActionType.LOGIN_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: true,
          user: action.payload.user,
          pending: false,
        },
      }

    case ActionType.LOGIN_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: false,
          pending: false,
          error: action.payload.error
        },
      }

    case ActionType.LOGOUT:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: null,
          error: null,
          pending: true,
        },
      }

    case ActionType.LOGOUT_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: false,
          user: null,
          pending: false,
        },
      }

    case ActionType.LOGOUT_FAILURE:
      return {
        ...state,
        auth: {
          ...state.auth,
          loggedIn: false,
          pending: false,
          error: action.payload.error
        },
      }

    case ActionType.SIGN:
      return {
        ...state,
        sign: {
          ...state.sign,
          pending: true,
          error: null,
        },
      }

    case ActionType.SIGN_SUCCESS:
      return {
        ...state,
        sign: {
          ...state.sign,
          signedDocumentIds: [...state.sign.signedDocumentIds, action.payload.documentId],
          pending: false,
        },
      }

    case ActionType.SIGN_FAILURE:
      return {
        ...state,
        sign: {
          ...state.sign,
          pending: false,
          error: action.payload.error
        },
      }

    default:
      throw new Error(`Unhandled action: ${JSON.stringify(action)}`)
  }
}
