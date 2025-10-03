import React, { useEffect } from 'react'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Modal = ({ isOpen, onClose, title, children, size = 'md' }: ModalProps) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  }

  return createPortal(
    <div className='fixed inset-0 z-50'>
      {/* Backdrop */}
      <div className='fixed inset-0 bg-black/50' onClick={onClose}></div>

      {/* Modal container */}
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <div
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-auto z-10`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='flex items-center justify-between p-6 border-b'>
            <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-600 transition-colors'>
              <XMarkIcon className='w-6 h-6' />
            </button>
          </div>

          <div className='p-6'>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
