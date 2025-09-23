import { Route, Routes } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Question from './pages/Question'

const App = () => {
  return (
    <main className='grid lg:grid-cols-12 md:grid-cols-4 min-h-screen bg-slate-100'>
      <Sidebar />
      <div className='xl:col-span-10 lg:col-span-9 md:col-span-3 p-8'>
        <Routes>
          <Route path='/' element={<Dashboard />} />
          <Route path='/question' element={<Question />} />
        </Routes>
      </div>
    </main>
  )
}

export default App
