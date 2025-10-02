import { useEffect, useState } from 'react'

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useSearchParams } from 'react-router-dom'

import CreateQuestionModal from '../components/CreateQuestionModal'
import DataTable, { type PagedData, type TableAction, type TableColumn } from '../components/DataTable'
import DeleteQuestionModal from '../components/DeleteQuestionModal'
import EditQuestionModal from '../components/EditQuestionModal'
import { type QuestionResponse, useQuestions } from '../hooks/useQuestions'

const QuestionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('search') || '')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionResponse | undefined>()

  const currentPage = Number(searchParams.get('page')) || 1
  const pageSize = Number(searchParams.get('pageSize')) || 50
  const searchValue = searchParams.get('search') || ''

  // Debounce search term with 2 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue)
    }, 2000)

    return () => clearTimeout(timer)
  }, [searchValue])

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
    setEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setEditModalOpen(false)
    setSelectedQuestion(undefined)
  }

  const handleCreateQuestion = () => {
    setCreateModalOpen(true)
  }

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false)
  }

  const handleDeleteQuestion = (question: QuestionResponse) => {
    setSelectedQuestion(question)
    setDeleteModalOpen(true)
  }

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false)
    setSelectedQuestion(undefined)
  }

  const renderAnswers = (question: QuestionResponse) => (
    <div>
      {question.answers.map((answer) => (
        <p key={answer.id}>
          {answer.answer}
          {answer.is_correct ? ' (Correcta)' : ''}
        </p>
      ))}
    </div>
  )

  // Default data structure if no data is available
  const defaultData: PagedData<QuestionResponse> = {
    items: [],
    page: 1,
    pageSize: 50,
    totalItems: 0,
    totalPages: 0,
  }

  const columns: TableColumn<QuestionResponse>[] = [
    { key: 'id', label: 'ID' },
    { key: 'question', label: 'Pregunta' },
    {
      key: 'answers',
      label: 'Respuestas',
      render: (question) => renderAnswers(question),
    },
    { key: 'actions', label: 'Acciones' },
  ]

  const actions: TableAction<QuestionResponse>[] = [
    {
      label: 'Editar',
      icon: <PencilSquareIcon className='w-5 h-5' />,
      onClick: (question: QuestionResponse) => handleEditQuestion(question),
    },
    {
      label: 'Eliminar',
      icon: <TrashIcon className='w-5 h-5' />,
      onClick: (question: QuestionResponse) => handleDeleteQuestion(question),
    },
  ]

  // Show error state if there's an error
  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
        <h2 className='text-lg font-semibold text-red-800 mb-2'>Error al cargar preguntas</h2>
        <p className='text-red-600'>{error instanceof Error ? error.message : 'Ocurrió un error inesperado'}</p>
      </div>
    )
  }

  return (
    <>
      <DataTable<QuestionResponse>
        title='Preguntas'
        isLoading={isLoading}
        data={transformedData || defaultData}
        columns={columns}
        actions={actions}
        emptyMessage='No existen registros'
        handlePageChange={handlePageChange}
        handlePageSizeChange={handlePageSizeChange}
        handleSearch={handleSearchChange}
        searchValue={searchValue}
        searchPlaceholder='Buscar por pregunta...'
        createAction={{
          label: 'Crear Pregunta',
          onClick: handleCreateQuestion,
        }}
      />

      <EditQuestionModal isOpen={editModalOpen} onClose={handleCloseEditModal} question={selectedQuestion} />
      <CreateQuestionModal isOpen={createModalOpen} onClose={handleCloseCreateModal} />
      <DeleteQuestionModal isOpen={deleteModalOpen} onClose={handleCloseDeleteModal} question={selectedQuestion} />
    </>
  )
}

export default QuestionPage
