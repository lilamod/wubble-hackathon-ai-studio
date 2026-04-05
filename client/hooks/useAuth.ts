'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import { api } from '@/lib/api'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null>
  register: (email: string, password: string) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.setToken(token)
      api.getMe()
        .then(res => setUser(res.data))
        .catch(() => { localStorage.removeItem('token'); api.setToken(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const u = await api.login(email, password)
      setUser(u)
      return u
    } catch (err) {
      throw err // let the caller handle the error message
    }
  }

  const register = async (email: string, password: string): Promise<User | null> => {
    try {
      const u = await api.register(email, password)
      setUser(u)
      return u
    } catch (err) {
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    api.setToken(null)
  }

  return React.createElement(AuthContext.Provider, { value: { user, loading, login, register, logout } }, children)
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
