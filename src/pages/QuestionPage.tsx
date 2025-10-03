import { useEffect, useState } from 'react'

import {
  ChevronRightIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline'
import { useSearchParams } from 'react-router-dom'

import { type PagedData } from '../components/DataTable'
import DeleteQuestionModal from '../components/DeleteQuestionModal'
import QuestionListView from '../components/QuestionListView'
import QuestionModal from '../components/QuestionModal'
import { type QuestionResponse, useQuestions } from '../hooks/useQuestions'

const QuestionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const [isSearching, setIsSearching] = useState(false)
  const [questionModalOpen, setQuestionModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | undefined>()

  const currentPage = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 50
  const searchValue = searchParams.get('search') || ''

  // Debounce search term with 2 second delay and loading indicator
  useEffect(() => {
    if (searchValue !== debouncedSearch) {
      setIsSearching(true)
    }

    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue)
      setIsSearching(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchValue, debouncedSearch])

  // Using React Query hook with debounced search
  const { data: transformedData, isLoading, error } = useQuestions(currentPage, pageSize, debouncedSearch)

  const handlePageChange = (page: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('page', page.toString())
      newParams.set('search', searchValue)
      return newParams
    })
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('pageSize', newPageSize.toString())
      newParams.set('page', '1') // Reset to first page when changing page size
      return newParams
    })
  }

  const handleSearchChange = (searchTerm: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('search', searchTerm)
      newParams.set('page', '1') // Reset to first page when searching
      return newParams
    })
  }

  const handleEditQuestion = (question: QuestionResponse) => {
    setSelectedQuestion(question)
    setQuestionModalOpen(true)
  }

  const handleCreateQuestion = () => {
    setSelectedQuestion(undefined)
    setQuestionModalOpen(true)
  }

  const handleCloseQuestionModal = () => {
    setQuestionModalOpen(false)
    setSelectedQuestion(undefined)
  }

  const handleDeleteQuestion = (question: QuestionResponse) => {
    setSelectedQuestion(question)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedQuestion(undefined)
  }

  // Default data structure if no data is available
  const defaultData: PagedData<QuestionResponse> = {
    items: [],
    page: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
  }

  // Enhanced error state with retry functionality
  if (error) {
    return (
      <div className='min-h-[400px] flex items-center justify-center'>
        <div className='text-center space-y-6 max-w-md'>
          <div className='text-red-500'>
            <ExclamationTriangleIcon className='w-16 h-16 mx-auto' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-xl font-semibold text-gray-900'>Error al cargar preguntas</h3>
            <p className='text-gray-600'>
              {error instanceof Error ? error.message : 'Ocurrió un error inesperado al cargar los datos.'}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors'
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        {/* Breadcrumbs */}
        <nav className='flex items-center space-x-2 text-sm text-gray-500 mb-4'>
          <HomeIcon className='w-4 h-4' />
          <span>Administración</span>
          <ChevronRightIcon className='w-4 h-4' />
          <span className='text-gray-900 font-medium'>Gestionar preguntas</span>
        </nav>

        {/* Page Title and Description */}
        <div className='flex items-start justify-between'>
          <div className='space-y-2'>
            <div className='flex items-center space-x-3'>
              <QuestionMarkCircleIcon className='w-8 h-8 text-blue-600' />
              <h1 className='text-2xl font-bold text-gray-900'>Gestión de Preguntas</h1>
            </div>
            <p className='text-gray-600 max-w-2xl'>
              Administra las preguntas del sistema educativo. Puedes crear, editar y eliminar preguntas, así como
              gestionar sus respuestas y configuraciones.
            </p>
          </div>

          {/* Stats Cards */}
          <div className='hidden md:flex space-x-4'>
            <div className='bg-blue-50 rounded-lg p-4 text-center min-w-[100px]'>
              <div className='text-2xl font-bold text-blue-600'>{transformedData?.items?.length || 0}</div>
              <div className='text-sm text-blue-600'>Total</div>
            </div>
            <div className='bg-green-50 rounded-lg p-4 text-center min-w-[100px]'>
              <div className='text-2xl font-bold text-green-600'>
                {transformedData?.items.filter((q) => q.status === 'AVAILABLE').length || 0}
              </div>
              <div className='text-sm text-green-600'>Activas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 md:block hidden'>
        <QuestionListView
          isLoading={isLoading}
          isSearching={isSearching}
          data={transformedData || defaultData}
          searchValue={searchValue}
          searchPlaceholder='Buscar por pregunta...'
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearchChange}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          onCreate={handleCreateQuestion}
        />
      </div>

      {/* Mobile Layout */}
      <div className='md:hidden'>
        <QuestionListView
          isLoading={isLoading}
          isSearching={isSearching}
          data={transformedData || defaultData}
          searchValue={searchValue}
          searchPlaceholder='Buscar por pregunta...'
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          onSearch={handleSearchChange}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
          onCreate={handleCreateQuestion}
        />
      </div>

      {/* Modals */}
      <QuestionModal isOpen={questionModalOpen} onClose={handleCloseQuestionModal} question={selectedQuestion} />
      <DeleteQuestionModal isOpen={deleteModalOpen} onClose={handleCloseDeleteModal} question={selectedQuestion} />
    </div>
  )
}

export default QuestionPage
