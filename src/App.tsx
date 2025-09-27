import { Navigate, Route, Routes } from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import AuthProvider from './contexts/AuthProvider'
import { useAuth } from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import Question from './pages/Question'
import SignIn from './pages/SignIn'

const AppContent = () => {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path='/sign-in' element={user ? <Navigate to='/' replace /> : <SignIn />} />
      <Route
        path='/*'
        element={
          <ProtectedRoute>
            <div className='grid lg:grid-cols-12 md:grid-cols-4 min-h-screen bg-slate-100'>
              <Sidebar />
              <div className='xl:col-span-10 lg:col-span-9 md:col-span-3 p-8'>
                <Routes>
                  <Route path='/' element={<Dashboard />} />
                  <Route path='/question' element={<Question />} />
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
      <AppContent />
    </AuthProvider>
  )
}

export default App
