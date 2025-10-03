import { useEffect, useState } from 'react'

import { CheckIcon, LightBulbIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'

import { type QuestionResponse } from '../hooks/useQuestions'

import DataTable, { type PagedData, type TableAction, type TableColumn } from './DataTable'
import QuestionCard from './QuestionCard'

interface QuestionListViewProps {
  isLoading: boolean
  isSearching?: boolean
  data: PagedData<QuestionResponse>
  searchValue: string
  searchPlaceholder: string
  // eslint-disable-next-line no-unused-vars
  onPageChange: (page: number) => void
  // eslint-disable-next-line no-unused-vars
  onPageSizeChange: (pageSize: number) => void
  // eslint-disable-next-line no-unused-vars
  onSearch: (searchTerm: string) => void
  // eslint-disable-next-line no-unused-vars
  onEdit: (question: QuestionResponse) => void
  // eslint-disable-next-line no-unused-vars
  onDelete: (question: QuestionResponse) => void
  onCreate: () => void
}

const QuestionListView = ({
  isLoading,
  isSearching = false,
  data,
  searchValue,
  searchPlaceholder,
  onPageChange,
  onPageSizeChange,
  onSearch,
  onEdit,
  onDelete,
  onCreate,
}: QuestionListViewProps) => {
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile view should be used
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  // Enhanced answer display for table view
  const renderAnswers = (question: QuestionResponse) => {
    const maxAnswersToShow = 2
    const visibleAnswers = question.answers.slice(0, maxAnswersToShow)
    const remainingCount = question.answers.length - maxAnswersToShow

    return (
      <div className='space-y-1'>
        {visibleAnswers.map((answer) => (
          <div key={answer.id} className='flex items-center space-x-2'>
            {answer.is_correct ? (
              <span className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0'></span>
            ) : (
              <span className='w-2 h-2 bg-gray-300 rounded-full flex-shrink-0'></span>
            )}
            <span className='text-sm text-gray-700 truncate max-w-xs' title={answer.answer}>
              {answer.answer}
            </span>
            {answer.is_correct && (
              <span className='bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full'>Correcta</span>
            )}
          </div>
        ))}
        {remainingCount > 0 && (
          <div className='text-xs text-gray-500 italic'>
            +{remainingCount} respuesta{remainingCount > 1 ? 's' : ''} más
          </div>
        )}
        <div className='text-xs text-gray-500 mt-1'>
          Total: {question.answers.length} respuesta{question.answers.length !== 1 ? 's' : ''}
        </div>
      </div>
    )
  }

  // Table columns configuration
  const columns: TableColumn<QuestionResponse>[] = [
    {
      key: 'id',
      label: 'ID',
      className: 'w-16 text-gray-500 font-mono text-sm hidden xl:table-cell',
    },
    {
      key: 'question',
      label: 'Pregunta',
      className: 'min-w-[100px]',
      render: (question) => (
        <div className='space-y-1'>
          <p className='font-medium text-gray-900 leading-tight'>{question.question}</p>
          {question.feedback && (
            <p className='text-sm text-gray-500 italic flex items-center space-x-1'>
              <LightBulbIcon className='w-4 h-4 flex-shrink-0' />
              <span>{question.feedback}</span>
            </p>
          )}
          <div className='flex items-center space-x-2 mt-2'>
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                question.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <span className='flex items-center space-x-1'>
                {question.status === 'AVAILABLE' ? (
                  <>
                    <CheckIcon className='w-3 h-3' />
                    <span>Disponible</span>
                  </>
                ) : (
                  <>
                    <XMarkIcon className='w-3 h-3' />
                    <span>No disponible</span>
                  </>
                )}
              </span>
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'answers',
      label: 'Respuestas',
      className: 'min-w-[200px] hidden md:table-cell',
      render: (question) => renderAnswers(question),
    },
    {
      key: 'actions',
      label: 'Acciones',
      className: 'w-24 text-right',
    },
  ]

  const actions: TableAction<QuestionResponse>[] = [
    {
      label: 'Editar',
      icon: <PencilSquareIcon className='w-5 h-5' />,
      className: 'p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors',
      onClick: onEdit,
    },
    {
      label: 'Eliminar',
      icon: <TrashIcon className='w-5 h-5' />,
      className: 'p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors',
      onClick: onDelete,
    },
  ]

  // Mobile card layout
  if (isMobile) {
    return (
      <div className='space-y-4'>
        {/* Mobile Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Preguntas</h2>
            <p className='text-sm text-gray-500'>
              {data.totalItems} pregunta{data.totalItems !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onCreate}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors'
          >
            Crear
          </button>
        </div>

        {/* Mobile Search */}
        <div className='px-4'>
          <div className='relative'>
            <input
              type='search'
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className={`w-full pl-4 pr-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                isSearching ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              }`}
              placeholder={searchPlaceholder}
              disabled={isLoading}
            />
            {isSearching && (
              <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Cards */}
        <div className='px-4 space-y-4'>
          {isLoading ? (
            // Mobile Loading Skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='bg-white rounded-lg border border-gray-200 p-4 space-y-3'>
                  <div className='flex justify-between items-start'>
                    <div className='space-y-2 flex-1'>
                      <div className='h-4 bg-gray-200 rounded w-20'></div>
                      <div className='h-6 bg-gray-200 rounded w-full'></div>
                      <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    </div>
                    <div className='flex space-x-2'>
                      <div className='h-8 w-8 bg-gray-200 rounded'></div>
                      <div className='h-8 w-8 bg-gray-200 rounded'></div>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='h-4 bg-gray-200 rounded w-24'></div>
                    <div className='h-4 bg-gray-200 rounded w-full'></div>
                    <div className='h-4 bg-gray-200 rounded w-5/6'></div>
                  </div>
                </div>
              </div>
            ))
          ) : data.items.length > 0 ? (
            data.items.map((question) => (
              <QuestionCard key={question.id} question={question} onEdit={onEdit} onDelete={onDelete} />
            ))
          ) : (
            <div className='text-center py-12'>
              <p className='text-gray-500'>No existen registros</p>
            </div>
          )}
        </div>

        {/* Mobile Pagination */}
        {data.totalPages > 1 && (
          <div className='px-4 py-4 border-t border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Página {data.page} de {data.totalPages}
              </div>
              <div className='flex space-x-2'>
                <button
                  onClick={() => onPageChange(data.page - 1)}
                  disabled={data.page <= 1}
                  className='px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Anterior
                </button>
                <button
                  onClick={() => onPageChange(data.page + 1)}
                  disabled={data.page >= data.totalPages}
                  className='px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Desktop table layout
  return (
    <DataTable<QuestionResponse>
      title='Preguntas'
      isLoading={isLoading}
      isSearching={isSearching}
      data={data}
      columns={columns}
      actions={actions}
      emptyMessage='No existen registros'
      handlePageChange={onPageChange}
      handlePageSizeChange={onPageSizeChange}
      handleSearch={onSearch}
      searchValue={searchValue}
      searchPlaceholder={searchPlaceholder}
      createAction={{
        label: 'Crear Pregunta',
        onClick: onCreate,
      }}
    />
  )
}

export default QuestionListView
