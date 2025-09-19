import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <main className='grid lg:grid-cols-12 md:grid-cols-4 min-h-screen'>
      <Sidebar />
      <div className='lg:col-span-9 md:col-span-3 p-8'>
        <h1 className='text-3xl font-bold'>Main content</h1>
        <p>Welcome to our e-commerce site</p>
      </div>
    </main>
  )
}

export default App
