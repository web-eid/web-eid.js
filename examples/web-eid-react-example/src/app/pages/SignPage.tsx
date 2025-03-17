import { useContext, useState } from 'react'
import { useSign } from '../hooks/useSign'
import { AppContext } from '../context/AppContext'
import { isKnownWebEidError } from '../utils/webEidUtils'
import { ErrorCode } from '@web-eid/web-eid-library'

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

      if (isKnownWebEidError(error)) {
        switch (error.code) {
          case ErrorCode.ERR_WEBEID_USER_CANCELLED:
            setAlert('You cancelled the ID-card authentication.')
            break

          case ErrorCode.ERR_WEBEID_USER_TIMEOUT:
            setAlert('Sorry, the ID-card PIN entry took too long.')
            break

          default:
            setAlert(error.message)
            break
        }
      } else {
        setAlert('Something went wrong.')
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
