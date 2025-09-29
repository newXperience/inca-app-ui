import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'

import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import AuthProvider from './contexts/AuthProvider'
import { useAuth } from './hooks/useAuth'
import DashboardPage from './pages/DashboardPage'
import QuestionPage from './pages/QuestionPage'
import SignInPage from './pages/SignInPage'

const AppContent = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path='/sign-in' element={user ? <Navigate to='/' replace /> : <SignInPage />} />
      <Route
        path='/*'
        element={
          <ProtectedRoute>
            <div className='grid lg:grid-cols-12 md:grid-cols-4 min-h-screen bg-slate-100'>
              <Sidebar />
              <div className='xl:col-span-10 lg:col-span-9 md:col-span-3 p-8'>
                <Routes>
                  <Route path='/' element={<DashboardPage />} />
                  <Route path='/question' element={<QuestionPage />} />
                  {/* <Route path='/unauthorized' element={<Unauthorized />} /> */}
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <Toaster />
      <AppContent />
    </AuthProvider>
  )
}

export default App
