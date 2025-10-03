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
    <div className='space-y-1'>
      <div className='px-6 pt-6 pb-4'>
        <div className='h-8 bg-gray-200 rounded w-64 mb-2'></div>
        <div className='h-4 bg-gray-200 rounded w-96'></div>
      </div>
      <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
        <div className='animate-pulse'>
          {/* Search Bar Skeleton */}
          <div className='bg-gradient-to-r from-gray-50 to-white px-6 py-6 border-b border-gray-200'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
              <div className='flex-1 max-w-2xl'>
                <div className='h-12 bg-gray-200 rounded-xl'></div>
              </div>
              <div className='h-12 w-48 bg-gray-200 rounded-xl'></div>
            </div>
          </div>

          {/* Table Header Skeleton */}
          <div className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-8 py-4'>
            <div className={`grid grid-cols-${columns.length} gap-4`}>
              {columns.map((_, index) => (
                <div key={index} className='h-4 bg-gray-300 rounded w-20'></div>
              ))}
            </div>
          </div>

          {/* Table Rows Skeleton */}
          <div className='divide-y divide-gray-100'>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className='px-8 py-5'>
                <div className={`grid grid-cols-${columns.length} gap-4 items-center`}>
                  {columns.map((column, colIndex) => {
                    if (column.key === 'actions') {
                      return (
                        <div key={colIndex} className='flex items-center justify-end space-x-1'>
                          <div className='h-9 w-9 bg-gray-200 rounded-lg'></div>
                          <div className='h-9 w-9 bg-gray-200 rounded-lg'></div>
                        </div>
                      )
                    }

                    if (column.key === 'id') {
                      return <div key={colIndex} className='h-4 bg-gray-200 rounded w-12'></div>
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
          <div className='px-6 py-4 bg-white border-t border-gray-100'>
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
    </div>
  )

  const tableHeader = columns.map((column, index) => (
    <th
      key={index}
      className={`px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wide ${
        column.className?.includes('text-right') ? 'text-right' : 'text-left'
      } ${column.className || ''} first:pl-8 last:pr-8`}
    >
      <div className='flex items-center space-x-2'>
        <span>{column.label}</span>
      </div>
    </th>
  ))

  const tableBody = data.items.map((item, index) => {
    const cells = columns.map((column, colIndex) => {
      if (column.key === 'actions' && actions) {
        return (
          <td key={colIndex} className='px-6 py-5 text-sm text-gray-900 text-right first:pl-8 last:pr-8'>
            <div className='flex items-center justify-end space-x-1'>
              {actions.map((action, actionIndex) => (
                <button
                  key={actionIndex}
                  className={
                    action.className ||
                    'p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 cursor-pointer'
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
              ? 'px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 first:pl-8 last:pr-8'
              : 'px-6 py-5 text-sm text-gray-900 first:pl-8 last:pr-8'
          }
        >
          <div className='max-w-xs lg:max-w-none'>{content}</div>
        </td>
      )
    })

    return (
      <tr key={index} className='hover:bg-gray-50 transition-colors duration-150 group'>
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
    <div className='bg-gradient-to-r from-gray-50 to-white px-6 py-6 border-b border-gray-200'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div className='flex-1 max-w-2xl'>
          <label htmlFor='search-input' className='sr-only'>
            Buscar
          </label>
          <div className='relative group'>
            <div className='absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10'>
              {isSearching ? (
                <div className='w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
              ) : (
                <MagnifyingGlassIcon className='w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors' />
              )}
            </div>
            <input
              type='search'
              id='search-input'
              value={searchValue}
              onChange={handleSearchChange}
              className={`block w-full pl-12 pr-6 py-4 text-sm bg-white border-2 rounded-xl shadow-sm transition-all duration-200 ${
                isSearching
                  ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
              } focus:outline-none placeholder-gray-500`}
              placeholder={searchPlaceholder}
              disabled={isLoading}
            />
            {isSearching && (
              <div className='absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none'>
                <span className='text-xs text-blue-600 font-semibold bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200'>
                  Buscando...
                </span>
              </div>
            )}
          </div>
        </div>
        {createAction && (
          <div className='flex-shrink-0'>
            <button
              type='button'
              onClick={createAction.onClick}
              className='inline-flex items-center px-8 py-4 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-3 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 active:scale-95'
              disabled={isLoading}
            >
              {createAction.icon && <span className='mr-2 text-blue-100'>{createAction.icon}</span>}
              <span className='font-medium'>{createAction.label}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className='space-y-1'>
      <div className='px-6 pt-6 pb-4'>
        <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>{title}</h1>
        <p className='mt-2 text-sm text-gray-600'>Gestiona y organiza la información de manera eficiente</p>
      </div>
      {isLoading ? (
        loader
      ) : data.items.length > 0 ? (
        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
          {searchBar}
          <div className='overflow-x-auto'>
            <table className='min-w-full'>
              <thead className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200'>
                <tr>{tableHeader}</tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-100'>{tableBody}</tbody>
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
        <div className='bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden'>
          {searchBar}
          <div className='px-6 py-20 text-center'>
            <div className='mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-100 mb-6'>
              <svg
                className='h-10 w-10 text-gray-400'
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
            <h3 className='text-xl font-semibold text-gray-900 mb-3'>{emptyMessage}</h3>
            <p className='text-sm text-gray-500 mb-6'>No hay información disponible en este momento.</p>
            {createAction && (
              <button
                onClick={createAction.onClick}
                className='inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors'
              >
                {createAction.icon && <span className='mr-2'>{createAction.icon}</span>}
                {createAction.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
