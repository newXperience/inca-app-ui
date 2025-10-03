interface ModalActionsProps {
  onCancel: () => void
  onSubmit?: () => void
  isLoading?: boolean
  submitText?: string
  disabled?: boolean
  submitType?: 'button' | 'submit'
}

const ModalActions = ({
  onCancel,
  onSubmit,
  isLoading = false,
  submitText = 'Guardar',
  disabled = false,
  submitType = 'submit',
}: ModalActionsProps) => {
  return (
    <div className='flex justify-end space-x-3 pt-6 border-t border-gray-200'>
      <button
        type='button'
        onClick={onCancel}
        disabled={isLoading}
        className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Cancelar
      </button>
      <button
        type={submitType}
        onClick={submitType === 'button' ? onSubmit : undefined}
        disabled={isLoading || disabled}
        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
      >
        {isLoading ? 'Guardando...' : submitText}
      </button>
    </div>
  )
}

export default ModalActions
