import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated || !user?.roles?.some(r => r.name === 'ADMIN')) {
      navigate('/')
    }
  }, [isAuthenticated, user, navigate])

  return children
}
