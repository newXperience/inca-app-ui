import React, { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'


import { apiClient } from '../services/apiClient'

import { AuthContext } from './AuthContext'

import type { ApiErrorResponse, AuthContextType, User } from '../types/auth'
import type { AxiosError } from 'axios'

const signInAPI = async (username: string, password: string) => {
  const { data } = await apiClient.instance.post(`/login`, {
    username,
    password,
  })
  console.log(data.data)
  if (data.data.role !== 'ADMIN') throw new Error('No tienes permiso para iniciar sesión')
  return data.data
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const expiresAt = localStorage.getItem('expiresAt')
    const storedUser = localStorage.getItem('user')

    if (!!token && !!storedUser && !!expiresAt && new Date(expiresAt) > new Date()) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('expiresAt')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const signInMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) => signInAPI(username, password),
    onSuccess: (userData: User) => {
      const token = userData.token
      const expiresAt = new Date(Date.now() + Number(userData.expiresIn) * 1000)
      localStorage.setItem('token', token)
      localStorage.setItem('expiresAt', expiresAt.toString())
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      setError(null)
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      setError(error.response?.data?.message || 'Error al iniciar sesión')
    },
  })

  const signIn = async (username: string, password: string): Promise<User> => {
    setError(null)
    return signInMutation.mutateAsync({ username, password })
  }

  const signOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('expiresAt')
    localStorage.removeItem('user')

    setUser(null)
    setError(null)

    queryClient.clear()
  }

  const contextValue: AuthContextType = {
    user,
    signIn,
    signOut,
    isLoading: isLoading || signInMutation.isPending,
    error: error || signInMutation.error?.response?.data?.message || null,
  }
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export default AuthProvider
