import { useEffect, useState } from 'react'

import { ArrowLeftIcon, ArrowRightIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

interface PaginationProps {
  pages: number
  currentPage?: number
  // eslint-disable-next-line no-unused-vars
  onPageChange: (currentPage: number) => void
  loading?: boolean
  showQuickJumper?: boolean
  showPageNumbers?: boolean
  maxPageNumbers?: number
  pageSize?: number
  // eslint-disable-next-line no-unused-vars
  onPageSizeChange?: (pageSize: number) => void
  showPageSizeSelector?: boolean
  pageSizeOptions?: number[]
}

const Pagination = ({
  pages,
  onPageChange,
  currentPage = 1,
  loading = false,
  showQuickJumper = true,
  showPageNumbers = true,
  maxPageNumbers = 7,
  pageSize = 50,
  onPageSizeChange,
  showPageSizeSelector = true,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) => {
  const [inputPage, setInputPage] = useState(currentPage)

  // Sync internal state with props
  useEffect(() => {
    setInputPage(currentPage)
  }, [currentPage])

  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pageNumbers: (number | string)[] = []
    const showEllipsis = pages > maxPageNumbers

    if (!showEllipsis) {
      // Show all pages if total is small
      return Array.from({ length: pages }, (_, i) => i + 1)
    }

    // Always show first page
    pageNumbers.push(1)

    // Calculate start and end range around current page
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(pages - 1, currentPage + 1)

    // Add ellipsis before start if needed
    if (start > 2) {
      pageNumbers.push('...')
    }

    // Add pages around current page
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== pages) {
        pageNumbers.push(i)
      }
    }

    // Add ellipsis after end if needed
    if (end < pages - 1) {
      pageNumbers.push('...')
    }

    // Always show last page if not already included
    if (pages > 1) {
      pageNumbers.push(pages)
    }

    return pageNumbers
  }

  const handlePageClick = (page: number) => {
    if (page !== Number(currentPage) && !loading) {
      onPageChange(page)
    }
  }

  const next = () => {
    if (Number(currentPage) >= pages || loading) return
    onPageChange(Number(currentPage) + 1)
  }

  const prev = () => {
    if (Number(currentPage) <= 1 || loading) return
    onPageChange(Number(currentPage) - 1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputPage(Number(value))
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const pageNumber = Number(inputPage)
    if (pageNumber >= 1 && pageNumber <= pages && pageNumber !== currentPage && !loading) {
      onPageChange(pageNumber)
    } else {
      setInputPage(currentPage)
    }
  }

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = Number(e.target.value)
    if (onPageSizeChange && newPageSize !== pageSize && !loading) {
      onPageSizeChange(newPageSize)
    }
  }

  if (pages <= 1) return null

  return (
    <nav
      className='flex flex-col lg:flex-row items-center justify-between px-4 lg:px-6 py-4 bg-white border-t border-gray-200'
      aria-label='Navegación de páginas'
      role='navigation'
    >
      {/* Mobile & Tablet: Optimized Layout */}
      <div className='lg:hidden w-full space-y-3'>
        {/* Top row: Page info and size selector */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-gray-500 font-medium'>
            P&aacute;gina {currentPage} de {pages}
          </span>
          {showPageSizeSelector && onPageSizeChange && (
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={loading}
              className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                loading ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300 bg-white'
              }`}
              aria-label='Items por página'
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option} por p&aacute;gina
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Bottom row: Navigation controls */}
        <div className='flex items-center justify-center space-x-3 sm:space-x-4'>
          <button
            className={`inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              Number(currentPage) === 1 || loading
                ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={prev}
            disabled={Number(currentPage) === 1 || loading}
            aria-label='Previous page'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1 sm:mr-2' />
          </button>

          {/* Show some page numbers on medium screens */}
          <div className='hidden sm:flex lg:hidden items-center space-x-1'>
            {generatePageNumbers()
              .slice(0, 5)
              .map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className='inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400'
                    >
                      <EllipsisHorizontalIcon className='h-4 w-4' />
                    </span>
                  )
                }

                const page = pageNum as number
                const isActive = page === Number(currentPage)

                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    disabled={loading}
                    className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : loading
                          ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              })}
          </div>

          {/* Show current page prominently on small screens */}
          <div className='sm:hidden inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white text-sm font-semibold rounded-md'>
            {currentPage}
          </div>

          <button
            className={`inline-flex items-center px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              Number(currentPage) === pages || loading
                ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50'
            }`}
            onClick={next}
            disabled={Number(currentPage) === pages || loading}
            aria-label='Next page'
          >
            <ArrowRightIcon className='h-4 w-4 ml-1 sm:ml-2' />
          </button>
        </div>
      </div>

      {/* Desktop: Full pagination */}
      <div className='hidden lg:flex lg:flex-1 lg:items-center lg:justify-between'>
        <div className='flex items-center space-x-6'>
          {/* Page info - simplified */}
          <span className='text-sm text-gray-500'>
            {currentPage} de {pages}
          </span>

          {/* Page size selector - cleaner */}
          {showPageSizeSelector && onPageSizeChange && (
            <div className='flex items-center space-x-2'>
              <select
                id='page-size-select'
                value={pageSize}
                onChange={handlePageSizeChange}
                disabled={loading}
                className={`px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  loading ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300 bg-white'
                }`}
                aria-label='Items por p&acute;gina'
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option} por p&acute;gina
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Jump to page - hidden by default, only show if really needed */}
          {showQuickJumper && pages > 10 && (
            <form onSubmit={handleInputSubmit} className='flex items-center space-x-2'>
              <span className='text-sm text-gray-400'>Go to:</span>
              <input
                id='page-input'
                type='number'
                min='1'
                max={pages}
                value={inputPage}
                onChange={handleInputChange}
                onBlur={handleInputSubmit}
                disabled={loading}
                className={`w-16 px-2 py-1.5 text-sm text-center border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                  loading ? 'bg-gray-100 border-gray-200 cursor-not-allowed' : 'border-gray-300'
                }`}
                aria-label='P&aacute;gina'
              />
            </form>
          )}
        </div>

        <div className='flex items-center space-x-2'>
          {/* Previous Button */}
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              Number(currentPage) === 1 || loading
                ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400'
            }`}
            onClick={prev}
            disabled={Number(currentPage) === 1 || loading}
            aria-label='P&aacute;gina anterior'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' />
          </button>

          {/* Page Numbers */}
          {showPageNumbers && (
            <div className='flex items-center space-x-1'>
              {generatePageNumbers().map((pageNum, index) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className='inline-flex items-center px-2 py-2 text-sm font-medium text-gray-400'
                    >
                      <EllipsisHorizontalIcon className='h-4 w-4' />
                    </span>
                  )
                }

                const page = pageNum as number
                const isActive = page === Number(currentPage)

                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    disabled={loading}
                    className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : loading
                          ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
          )}

          {/* Next Button */}
          <button
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
              Number(currentPage) === pages || loading
                ? 'text-gray-300 bg-gray-50 cursor-not-allowed'
                : 'text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700 hover:border-gray-400'
            }`}
            onClick={next}
            disabled={Number(currentPage) === pages || loading}
            aria-label='Next page'
          >
            <ArrowRightIcon className='h-4 w-4 ml-1' />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className='absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center'>
          <div className='flex items-center space-x-2 text-sm text-gray-500'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
            <span>Cargando...</span>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Pagination
