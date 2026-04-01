import { useContext, useState } from 'react'
import { useSign } from '../hooks/useSign'
import { AppContext } from '../context/AppContext'
import { isKnownWebEidError } from '../utils/webEidUtils'
import {
  DeveloperError,
  NativeFatalError,
  UnknownError,
  UserCancelledError,
  UserTimeoutError,
} from '@web-eid/web-eid-library';

enum SigningSteps {
  Initial = 0,
  Signing = 1,
  Success = 2,
}

export function SignPage() {
  const {
    state: {
      auth: { user }
    }
  } = useContext(AppContext)

  const { sign } = useSign()

  const [step, setStep] = useState<SigningSteps>(SigningSteps.Initial)
  const [alert, setAlert] = useState<string | null>(null)

  async function onSign() {
    setStep(SigningSteps.Signing)
    try {
      await sign('example-document')
      setStep(SigningSteps.Success)
    } catch (error) {
      setStep(SigningSteps.Initial)

      if (error instanceof UserTimeoutError) {
        setAlert("ID-card authentication timed out, please try again");
      } else if (error instanceof UserCancelledError) {
        setAlert("ID-card authentication was cancelled by the user");
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
    }
  }

  return (
    <>
      <h2 className="adding-signature">Digital signing demo</h2>
      <p className="welcome-line">Welcome, {user?.sub}!</p>

      {(step === SigningSteps.Initial || step === SigningSteps.Signing) && (
        <>
          <p>
            You can sign the example document by clicking <i>Sign document</i> below.
          </p>
          <div className="text-center">
            <button
              id="webeid-sign-button"
              className="btn btn-primary"
              onClick={onSign}
              disabled={step === SigningSteps.Signing}
            >
              Sign document
            </button>
          </div>
        </>
      )}

      {step === SigningSteps.Success && (
        <div className="alert alert-success" role="alert">
          Document signed successfully!
        </div>
      )}

      {alert && (
        <div className="alert alert-danger mt-4" role="alert">
          {alert}
        </div>
      )}
    </>
  )
}
