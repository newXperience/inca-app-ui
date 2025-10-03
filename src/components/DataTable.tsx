import React from 'react'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import Pagination from './Pagination'

export interface PagedData<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface TableColumn<T> {
  key: keyof T | 'actions'
  label: string
  className?: string
  // eslint-disable-next-line no-unused-vars
  render?: (item: T, value: unknown) => React.ReactNode
}

export interface TableAction<T> {
  label: string
  icon?: React.ReactNode
  className?: string
  // eslint-disable-next-line no-unused-vars
  onClick: (item: T) => void
}

export interface DataTableProps<T> {
  title: string
  isLoading: boolean
  isSearching?: boolean
  data: PagedData<T>
  columns: TableColumn<T>[]
  actions?: TableAction<T>[]
  emptyMessage?: string
  // eslint-disable-next-line no-unused-vars
  handlePageChange: (page: number) => void
  // eslint-disable-next-line no-unused-vars
  handlePageSizeChange?: (pageSize: number) => void
  // eslint-disable-next-line no-unused-vars
  handleSearch?: (searchTerm: string) => void
  searchValue?: string
  searchPlaceholder?: string
  createAction?: {
    label: string
    icon?: React.ReactNode
    className?: string
    onClick: () => void
  }
}

const DataTable = <T,>({
  title,
  isLoading,
  isSearching = false,
  data,
  columns,
  actions,
  emptyMessage = 'No records found',
  handlePageChange,
  handlePageSizeChange,
  handleSearch,
  searchValue = '',
  searchPlaceholder = 'Buscar...',
  createAction,
}: DataTableProps<T>) => {
  const loader = (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
      <div className='animate-pulse'>
        {/* Table Header Skeleton */}
        <div className='bg-gray-50 px-6 py-3 border-b border-gray-200'>
          <div className={`grid grid-cols-${columns.length} gap-4`}>
            {columns.map((_, index) => (
              <div key={index} className='h-4 bg-gray-300 rounded w-20'></div>
            ))}
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className='divide-y divide-gray-200'>
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className='px-6 py-4'>
              <div className={`grid grid-cols-${columns.length} gap-4 items-center`}>
                {columns.map((column, colIndex) => {
                  if (column.key === 'actions') {
                    return (
                      <div key={colIndex} className='flex items-center space-x-3'>
                        <div className='h-8 w-8 bg-gray-200 rounded'></div>
                        <div className='h-8 w-8 bg-gray-200 rounded'></div>
                      </div>
                    )
                  }

                  if (column.key === 'id') {
                    return <div key={colIndex} className='h-4 bg-gray-200 rounded w-8'></div>
                  }

                  return (
                    <div key={colIndex} className='space-y-2'>
                      <div className='h-4 bg-gray-200 rounded w-full'></div>
                      <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className='px-4 py-3 bg-white border-t border-gray-200'>
          <div className='flex items-center justify-between'>
            <div className='h-4 bg-gray-200 rounded w-32'></div>
            <div className='flex items-center space-x-1'>
              <div className='h-8 w-8 bg-gray-200 rounded'></div>
              <div className='h-8 w-8 bg-gray-200 rounded'></div>
              <div className='h-8 w-8 bg-gray-200 rounded'></div>
              <div className='h-8 w-8 bg-gray-200 rounded'></div>
              <div className='h-8 w-8 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const tableHeader = columns.map((column, index) => (
    <th
      key={index}
      className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
        column.className?.includes('text-right') ? 'text-right' : 'text-left'
      } ${column.className || ''}`}
    >
      {column.label}
    </th>
  ))

  const tableBody = data.items.map((item, index) => {
    const cells = columns.map((column, colIndex) => {
      if (column.key === 'actions' && actions) {
        return (
          <td key={colIndex} className='px-6 py-4 text-sm text-gray-900 text-right'>
            <div className='flex items-center justify-end space-x-2'>
              {actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  className={
                    action.className ||
                    'p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer'
                  }
                  title={action.label}
                  onClick={() => action.onClick(item)}
                >
                  {action.icon}
                </button>
              ))}
            </div>
          </td>
        )
      }

      const value = item[column.key as keyof T]
      const content = column.render ? column.render(item, value) : String(value || '')

      return (
        <td
          key={colIndex}
          className={
            column.key === 'id'
              ? 'px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'
              : 'px-6 py-4 text-sm text-gray-900'
          }
        >
          {content}
        </td>
      )
    })

    return (
      <tr key={index} className='hover:bg-gray-50'>
        {cells}
      </tr>
    )
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value
    if (handleSearch) {
      handleSearch(searchTerm)
    }
  }

  const searchBar = handleSearch && (
    <div className='px-6 py-4 border-b border-gray-200'>
      <div className='flex items-center justify-between'>
        <div className='flex-1 max-w-md'>
          <label htmlFor='search-input' className='sr-only'>
            Buscar
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
              {isSearching ? (
                <div className='w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <MagnifyingGlassIcon className='w-4 h-4 text-gray-400' />
              )}
            </div>
            <input
              type='search'
              id='search-input'
              value={searchValue}
              onChange={handleSearchChange}
              className={`block w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                isSearching ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
              }`}
              placeholder={searchPlaceholder}
              disabled={isLoading}
            />
            {isSearching && (
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                <span className='text-xs text-blue-600 font-medium'>Buscando...</span>
              </div>
            )}
          </div>
        </div>
        {createAction && (
          <button
            type='button'
            onClick={createAction.onClick}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer'
          >
            {createAction.label}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <h1 className='text-2xl font-bold mb-6 text-gray-900'>{title}</h1>
      {isLoading ? (
        loader
      ) : data.items.length > 0 ? (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          {searchBar}
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>{tableHeader}</tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>{tableBody}</tbody>
            </table>
          </div>
          <Pagination
            pages={data?.totalPages || 0}
            currentPage={data?.page || 0}
            onPageChange={handlePageChange}
            pageSize={data?.pageSize || 50}
            onPageSizeChange={handlePageSizeChange}
            loading={isLoading}
          />
        </div>
      ) : (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <div className='px-6 py-16 text-center'>
            <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4'>
              <svg
                className='h-8 w-8 text-gray-400'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                aria-hidden='true'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>{emptyMessage}</h3>
            <p className='text-sm text-gray-500'>No data available at this time.</p>
          </div>
        </div>
      )}
    </>
  )
}

export default DataTable
