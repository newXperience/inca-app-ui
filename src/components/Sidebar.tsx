import { NavLink } from 'react-router-dom'

import logo from '../assets/logo.png'
import questionMark from '../assets/question-mark.svg'
import { useAuth } from '../hooks/useAuth'

const Sidebar = () => {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
  }

  return (
    <div className='xl:col-span-2 lg:col-span-3 md:col-span-1 bg-gray-800 text-white p-4 min-h-full'>
      <div className='space-y-4'>
        <NavLink to='/' className='flex items-center space-x-2'>
          <img className='w-10 h-10' src={logo} alt='Logo' />
          <h1 className='text-lg font-semibold'>Administración</h1>
        </NavLink>
        <nav className='space-y-2'>
          <NavLink to='/question' className='flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer'>
            <img className='w-5 h-5' src={questionMark} alt='questions-icon' />
            <span>Gestionar preguntas</span>
          </NavLink>
        </nav>
      </div>

      <div className='border-t border-gray-700 pt-4 mt-4'>
        <div className='text-sm text-gray-400 mb-2'>Bienvenido {user?.fullName}</div>
        <div className='text-sm text-gray-400 mb-3'>{user?.role}</div>
        <button
          onClick={handleSignOut}
          className='w-full text-left text-gray-300 hover:text-white text-sm py-2 px-2 rounded hover:bg-gray-700 transition-colors'
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

export default Sidebar
