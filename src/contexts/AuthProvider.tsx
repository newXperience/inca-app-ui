import React, { useEffect, useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

import { AuthContext } from './AuthContext'

import type { ApiErrorResponse, AuthContextType, User } from '../types/auth'

const signInAPI = async (username: string, password: string) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/login`,
    {
      username,
      password,
    },
    {
      headers: { 'x-api-key': import.meta.env.VITE_AWS_API_KEY },
    }
  )
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
    if (token && expiresAt && new Date(expiresAt) > new Date() && storedUser) {
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
      const expiresAt = userData.expiresIn
      localStorage.setItem('token', token)
      localStorage.setItem('expiresAt', expiresAt)
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
