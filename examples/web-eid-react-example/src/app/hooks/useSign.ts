import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ActionType } from '../state/actions'
import * as webeid from '@web-eid/web-eid-library'

export function useSign() {
  const { state, dispatch } = useContext(AppContext)

  async function sign(documentId: string) {
    dispatch({ type: ActionType.SIGN })

    try {
      const lang = state.language

      const { certificate, supportedSignatureAlgorithms } = await webeid.getSigningCertificate({ lang })
  
      const prepareSigningResponse = await (await fetch('/sign/prepare?' + new URLSearchParams({ documentId }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate, supportedSignatureAlgorithms }),
      })).json()
  
      const { hash, hashFunction } = prepareSigningResponse
  
      const { signatureAlgorithm, signature } = await webeid.sign(certificate, hash, hashFunction, { lang })
  
      const finalizeSigningResponse = await (await fetch('/sign/sign?' + new URLSearchParams({ documentId }), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, signatureAlgorithm }),
      })).json()

      console.log('Signing result', finalizeSigningResponse)
  
      dispatch({ type: ActionType.SIGN_SUCCESS, payload: { documentId } })
    } catch (error) {
      dispatch({ type: ActionType.SIGN_FAILURE, payload: { error } })
      throw error
    }
  }

  return { sign }
}
