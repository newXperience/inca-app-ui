const Sidebar = () => {
  return (
    <div className='lg:col-span-3 md:col-span-1 bg-gray-800 text-white p-4 min-h-full'>
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Navigation</h2>
        <nav className='space-y-2'>
          <div className='text-gray-300 hover:text-white cursor-pointer'>Dashboard</div>
          <div className='text-gray-300 hover:text-white cursor-pointer'>Products</div>
          <div className='text-gray-300 hover:text-white cursor-pointer'>Orders</div>
          <div className='text-gray-300 hover:text-white cursor-pointer'>Customers</div>
          <div className='text-gray-300 hover:text-white cursor-pointer'>Settings</div>
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
