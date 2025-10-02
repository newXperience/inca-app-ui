import { type QuestionResponse, useDeleteQuestion } from '../hooks/useQuestions'

import Modal from './Modal'

interface DeleteQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  question: QuestionResponse | undefined
}

const DeleteQuestionModal = ({ isOpen, onClose, question }: DeleteQuestionModalProps) => {
  const deleteQuestionMutation = useDeleteQuestion()

  const handleSubmit = () => {
    if (!question?.id) return
    deleteQuestionMutation.mutate(question.id)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Eliminar Pregunta' size='lg'>
      <p>¿Estás seguro de eliminar la pregunta "{question?.question}"?</p>
      <div className='flex justify-end space-x-3 pt-6 border-t'>
        <button
          type='button'
          onClick={onClose}
          disabled={deleteQuestionMutation.isPending}
          className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50'
        >
          Cancelar
        </button>
        <button
          type='button'
          onClick={handleSubmit}
          disabled={deleteQuestionMutation.isPending}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors'
        >
          {deleteQuestionMutation.isPending ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  )
}

export default DeleteQuestionModal
