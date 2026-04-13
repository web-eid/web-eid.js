interface WebEidError extends Error {
  code: string
  message: string
}

export function isKnownWebEidError(error: unknown): error is WebEidError {
    return (
      typeof error == 'object' && error != null &&
      'message' in error && typeof error.message == 'string' &&
      'code' in error && typeof error.code == 'string' &&
      error.code.startsWith('ERR_WEBEID_')
    )
}
