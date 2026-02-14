import { useContext, useEffect } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const {
    state: {
      auth: { loggedIn }
    }
  } = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (loggedIn === false) {
      navigate('/')
    }
  }, [loggedIn, navigate])

  return <>{ loggedIn ? children : <div>Loading...</div> }</>
}
