import { NavLink } from 'react-router'
import './Header.css'
import { ActionType } from '../state/actions'
import { useContext } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AppContext } from '../context/AppContext'
import { config } from '../config'

function Header() {
  const {
    state: {
      auth: { loggedIn },
      language
    },
    dispatch
  } = useContext(AppContext)

  const { logout } = useAuth()

  const onLogout = () => {
    logout()
  }

  return <>
    <header className="container">
      <nav className="
        navbar navbar-expand-lg navbar-light bg-light
        px-2 d-flex flex-nowrap overflow-hidden justify-content-between
      ">
        <NavLink to="/" aria-label="Homepage" end>
          <img className="logo" alt="eID logo" src="site_logo.png" />
        </NavLink>

        <div className="actions">
          <div className="vr mx-1"></div>

          <div className="language">
              <label htmlFor="language">Web eID language:</label>
              <select
                className="form-select"
                name="language"
                id="language"
                value={language}
                onChange={(e) => dispatch({ type: ActionType.CHANGE_LANGUAGE, payload: e.target.value })}
              >
                {config.languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {loggedIn && (
              <>
                <div className="vr mx-1"></div>
                <button type="button" className="btn btn-primary" onClick={onLogout}>
                  Logout
                </button>
              </>
            )}
        </div>
      </nav>
    </header>
  </>
}

export default Header
