import { useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { signIn, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await signIn(formData.get('username') as string, formData.get('password') as string)
      navigate(from, { replace: true })
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>Iniciar Sesión</h2>
          <p className='text-center text-sm text-gray-600'>Accede a tu cuenta de administración</p>
        </div>

        <form className='space-y-6' action={handleSubmit}>
          {error && <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>{error}</div>}
          <div className='space-y-4'>
            <input
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='text'
              name='username'
              required
              placeholder='Usuario'
              disabled={isSubmitting}
            />
            <input
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              type='password'
              name='password'
              required
              placeholder='Contraseña'
              disabled={isSubmitting}
            />
            <button
              type='submit'
              className='w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignIn
