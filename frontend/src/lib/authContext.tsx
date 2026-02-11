'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient from './apiClient'

interface User {
  id: number
  email: string
  role: 'owner' | 'editor'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('user')
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const userData = response.data.data
        setUser(userData)
        localStorage.setItem('authToken', userData.token)
        localStorage.setItem('user', JSON.stringify({
          id: userData.id,
          email: userData.email,
          role: userData.role,
        }))
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
