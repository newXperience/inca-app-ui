import logo from '../assets/logo.png'
import questionMark from '../assets/question-mark.svg'

const Sidebar = () => {
  return (
    <div className='lg:col-span-3 md:col-span-1 bg-gray-800 text-white p-4 min-h-full'>
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <img className='w-10 h-10' src={logo} alt='Logo' />
          <h1 className='text-lg font-semibold'>Administración</h1>
        </div>
        <nav className='space-y-2'>
          <a href='/questions' className='flex items-center space-x-2 text-gray-300 hover:text-white cursor-pointer'>
            <img className='w-5 h-5' src={questionMark} alt='questions-icon' />
            <span>Gestionar preguntas</span>
          </a>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
