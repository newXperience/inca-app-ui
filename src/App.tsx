import Sidebar from './components/Sidebar'

const App = () => {
  return (
    <main className='grid lg:grid-cols-12 md:grid-cols-4 min-h-screen bg-slate-100'>
      <Sidebar />
      <div className='lg:col-span-9 md:col-span-3 p-8'>
        {/* Welcome Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Bienvenido de vuelta, Victor Soto!!</h1>
          <p className='text-gray-600'>
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center'>
                <span className='text-blue-600 text-xl'>❓</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 ml-3'>Gestionar Preguntas</h3>
            </div>
            <p className='text-gray-600 text-sm'>Crear, editar y organizar las preguntas del cuestionario</p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center'>
                <span className='text-green-600 text-xl'>📊</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 ml-3'>Ver Estadísticas</h3>
            </div>
            <p className='text-gray-600 text-sm'>Analizar respuestas y métricas de la aplicación móvil</p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer'>
            <div className='flex items-center mb-4'>
              <div className='w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center'>
                <span className='text-purple-600 text-xl'>⚙️</span>
              </div>
              <h3 className='text-lg font-semibold text-gray-800 ml-3'>Configuración</h3>
            </div>
            <p className='text-gray-600 text-sm'>Ajustar configuraciones del sistema y preferencias</p>
          </div>
        </div>

        {/* Status Overview */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Preguntas</p>
                <p className='text-2xl font-bold text-gray-800'>24</p>
              </div>
              <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
                <span className='text-blue-600'>📝</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Cuestionarios Activos</p>
                <p className='text-2xl font-bold text-gray-800'>3</p>
              </div>
              <div className='w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center'>
                <span className='text-green-600'>✅</span>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Respuestas Hoy</p>
                <p className='text-2xl font-bold text-gray-800'>47</p>
              </div>
              <div className='w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center'>
                <span className='text-orange-600'>📱</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
