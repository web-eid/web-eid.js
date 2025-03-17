import { useEffect, useRef } from 'react'

export function useCallOnce(fn: () => void) {
  const isCalled = useRef(false)

  useEffect(() => {
    if (!isCalled.current) {
      fn()
      isCalled.current = true
    }
  }, [fn])
}
