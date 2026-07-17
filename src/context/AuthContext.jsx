import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser } from '../api/bookApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('accessToken'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      getCurrentUser()
        .then((res) => setUser(res.data))
        .catch(() => setUser(null))
    } else {
      setUser(null)
    }
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