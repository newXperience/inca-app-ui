import React from 'react'

import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: string
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading, error } = useAuth()
  const location = useLocation()

  if (isLoading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    )

  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='text-red-500'>{error}</div>
      </div>
    )

  if (!user) {
    return <Navigate to='/sign-in' state={{ from: location }} replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/unauthorized' state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
