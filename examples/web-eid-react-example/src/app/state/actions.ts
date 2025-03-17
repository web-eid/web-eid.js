export enum ActionType {
  CHECK_AUTH = 'CHECK_AUTH',
  CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS',
  CHECK_AUTH_FAILURE = 'CHECK_AUTH_FAILURE',

  LOGIN = 'LOGIN',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  
  LOGOUT = 'LOGOUT',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  LOGOUT_FAILURE = 'LOGOUT_FAILURE',
  
  SIGN = 'SIGN',
  SIGN_SUCCESS = 'SIGN_SUCCESS',
  SIGN_FAILURE = 'SIGN_FAILURE',

  CHANGE_LANGUAGE = 'CHANGE_LANGUAGE',
}

export interface CheckAuthAction {
  type: ActionType.CHECK_AUTH
}

export interface CheckAuthSuccessAction {
  type: ActionType.CHECK_AUTH_SUCCESS
  payload: {
    user: { sub: string, auth: string }
  }
}

export interface CheckAuthFailureAction {
  type: ActionType.CHECK_AUTH_FAILURE
  payload: {
    error: unknown
  }
}

export interface LoginAction {
  type: ActionType.LOGIN
}

export interface LoginSuccessAction {
  type: ActionType.LOGIN_SUCCESS
  payload: {
    user: { sub: string, auth: string }
  }
}

export interface LoginFailureAction {
  type: ActionType.LOGIN_FAILURE
  payload: {
    error: unknown
  }
}

export interface LogoutAction {
  type: ActionType.LOGOUT
}

export interface LogoutSuccessAction {
  type: ActionType.LOGOUT_SUCCESS
}

export interface LogoutFailureAction {
  type: ActionType.LOGOUT_FAILURE
  payload: {
    error: unknown
  }
}

export interface SignDocumentAction {
  type: ActionType.SIGN
}

export interface SignDocumentSuccessAction {
  type: ActionType.SIGN_SUCCESS
  payload: {
    documentId: string
  }
}

export interface SignDocumentFailureAction {
  type: ActionType.SIGN_FAILURE
  payload: {
    error: unknown
  }
}

export interface ChangeLanguageAction {
  type: ActionType.CHANGE_LANGUAGE
  payload: string
}

export type Action
  = CheckAuthAction
  | CheckAuthSuccessAction
  | CheckAuthFailureAction
  | LoginAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | LogoutSuccessAction
  | LogoutFailureAction
  | SignDocumentAction
  | SignDocumentSuccessAction
  | SignDocumentFailureAction
  | ChangeLanguageAction
