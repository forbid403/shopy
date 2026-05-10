import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { login as apiLogin, register as apiRegister } from '../services/api'

interface AuthUser {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('token'))

  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    if (stored && token) setUser(JSON.parse(stored))
  }, [])

  function persist(token: string, user: AuthUser) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  async function login(email: string, password: string) {
    const { data } = await apiLogin(email, password)
    persist(data.token, data.user)
  }

  async function register(name: string, email: string, password: string) {
    const { data } = await apiRegister(name, email, password)
    persist(data.token, data.user)
  }

  function logout() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
