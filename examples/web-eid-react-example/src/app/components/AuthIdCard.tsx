import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { isKnownWebEidError } from '../utils/webEidUtils'
import {
  ContextInsecureError,
  DeveloperError,
  ExtensionUnavailableError,
  NativeFatalError,
  NativeUnavailableError,
  UnknownError,
  UserCancelledError,
  UserTimeoutError,
  VersionInvalidError,
  VersionMismatchError
} from '@web-eid/web-eid-library';
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
      if (error instanceof UserTimeoutError) {
        setAlert("ID-card authentication timed out, please try again");
      } else if (error instanceof UserCancelledError) {
        setAlert("ID-card authentication was cancelled by the user");
      } else if (error instanceof ExtensionUnavailableError) {
        setAlert("Web eID browser extension is not available, please install it or enable it to continue");
      } else if (error instanceof NativeUnavailableError) {
        setAlert("Web eID native application is not installed, please install it to continue");
      } else if (error instanceof VersionInvalidError) {
        setAlert("Web eID native application did not provide a valid version string during handshake, please report a bug");
      } else if (error instanceof VersionMismatchError) {
        if (error.requiresUpdate?.extension) {
          setAlert("Please update the Web eID browser extension");
        } else if (error.requiresUpdate?.nativeApp) {
          setAlert("Please update the Web eID native application");
        } else {
          setAlert("Please update the Web eID native application and browser extension");
        }
      } else if (error instanceof ContextInsecureError) {
        setAlert("Web eID requires a secure HTTPS connection. Please contact the website administrator");
      } else if (error instanceof NativeFatalError) {
        setAlert("Please try again. If the problem persists, contact support");
      } else if (error instanceof DeveloperError) {
        setAlert(`An internal error occurred. Please contact support! ${error.message}`);
      } else if (error instanceof UnknownError) {
        setAlert(`An unknown error occurred. Please try again and contact support if the problem persists! ${error.message} (${error.code})`);
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorCode = isKnownWebEidError(error) ? ` (${(error as any).code})` : "";
        setAlert(`An unknown error occurred. Please try again and contact support if the problem persists! ${errorMessage}${errorCode}`);
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
