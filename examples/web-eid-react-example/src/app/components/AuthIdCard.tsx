import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { isKnownWebEidError } from '../utils/webEidUtils'
import { ErrorCode } from '@web-eid/web-eid-library'
import { useNavigate } from 'react-router'

export function AuthIdCard() {
  const { loginWithIdCard } = useAuth()
  const [ loading, setLoading ] = useState(false)
  const [ alert, setAlert ] = useState<string | undefined>()
  const navigate = useNavigate()

  const onLogin = async () => {
    setLoading(true)
    setAlert(undefined)

    try {
      await loginWithIdCard()
      navigate('/sign')
    } catch (error) {
      if (isKnownWebEidError(error)) {
        switch (error.code) {
          case ErrorCode.ERR_WEBEID_USER_CANCELLED:
            setAlert('You cancelled the ID-card authentication.')
            break

          case ErrorCode.ERR_WEBEID_USER_TIMEOUT:
            setAlert('Sorry, the ID-card PIN entry took too long.')
            break

          case ErrorCode.ERR_WEBEID_NATIVE_FATAL:
            if (window.location.hostname === 'localhost' && window.location.protocol === 'http:') {
              setAlert(
                'HTTPS is required for Web-eID authentication.\n' + 
                'For development, you can allow HTTP for localhost in the Web eID DevTools.'
              )
            }
            break

          default:
            setAlert(error.message)
            break
        }
      } else {
        setAlert('Something went wrong.')
      }

      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        onClick={onLogin}
      >
        Login
      </button>

      {alert && (
        <div className="alert alert-danger my-4" role="alert" style={{ whiteSpace: 'pre-wrap' }}>
          {alert}
        </div>
      )}
    </>
  )
}
