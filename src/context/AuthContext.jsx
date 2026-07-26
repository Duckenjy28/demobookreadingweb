/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/bookApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('accessToken'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    let cancelled = false
    if (token) {
      getCurrentUser()
        .then((res) => { if (!cancelled) setUser(res.data) })
        .catch(() => { if (!cancelled) setUser(null) })
    } else {
      // avoid calling setState synchronously inside effect
      setTimeout(() => { if (!cancelled) setUser(null) }, 0)
    }
    return () => { cancelled = true }
  }, [token])

  const loginUser = (accessToken) => {
    localStorage.setItem('accessToken', accessToken)
    setToken(accessToken)
  }

  const logoutUser = () => {
    localStorage.removeItem('accessToken')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, loginUser, logoutUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}