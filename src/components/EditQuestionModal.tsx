import { useEffect, useState } from 'react'

import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'

import { type QuestionResponse, type UpdateQuestionRequest, useUpdateQuestion } from '../hooks/useQuestions'

import Modal from './Modal'

interface EditQuestionModalProps {
  isOpen: boolean
  onClose: () => void
  question?: QuestionResponse
}

const EditQuestionModal = ({ isOpen, onClose, question }: EditQuestionModalProps) => {
  const [answers, setAnswers] = useState<{ value: string; isCorrect: boolean }[]>([])
  const updateQuestionMutation = useUpdateQuestion()

  // Initialize form with question data
  useEffect(() => {
    if (question?.answers) {
      setAnswers(
        question.answers.map((ans) => ({
          value: ans.answer,
          isCorrect: ans.is_correct,
        }))
      )
    } else {
      // Default for new questions
      setAnswers([{ value: '', isCorrect: false }])
    }
  }, [question])

  // Form Action with proper signature and validation
  const submitAction = (formData: FormData) => {
    const questionText = formData.get('question') as string
    const feedback = formData.get('feedback') as string
    const status = formData.get('status') as 'AVAILABLE' | 'UNAVAILABLE'

    // Client-side validation
    if (!questionText?.trim()) {
      toast.error('La pregunta es requerida')
      return
    }

    if (answers.length === 0) {
      toast.error('Se requiere al menos una respuesta')
      return
    }

    const validAnswers = answers.filter((a) => a.value.trim())
    if (validAnswers.length === 0) {
      toast.error('Se requiere al menos una respuesta con texto')
      return
    }

    if (!validAnswers.some((a) => a.isCorrect)) {
      toast.error('Debe haber al menos una respuesta correcta')
      return
    }

    if (!question?.id) {
      toast.error('ID de pregunta no válido')
      return
    }

    const data: UpdateQuestionRequest = {
      question: questionText.trim(),
      feedback: feedback?.trim() || '',
      status,
      answers: validAnswers,
    }

    // Execute mutation with proper error handling
    updateQuestionMutation.mutate(
      { id: question.id, data },
      {
        onSuccess: () => {
          toast.success('Pregunta actualizada correctamente')
          onClose()
        },
        onError: (error) => {
          console.error('Error updating question:', error)
          toast.error('Error al actualizar la pregunta')
        },
      }
    )
  }

  // Answer management functions
  const addAnswer = () => {
    setAnswers((prev) => [...prev, { value: '', isCorrect: false }])
  }

  const removeAnswer = (index: number) => {
    setAnswers((prev) => prev.filter((_, i) => i !== index))
  }

  const updateAnswer = (index: number, field: 'value' | 'isCorrect', value: string | boolean) => {
    setAnswers((prev) => prev.map((answer, i) => (i === index ? { ...answer, [field]: value } : answer)))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Editar Pregunta' size='lg'>
      <form action={submitAction} className='space-y-6'>
        {/* Question Field */}
        <div>
          <label htmlFor='question' className='block text-sm font-medium text-gray-700 mb-2'>
            Pregunta *
          </label>
          <textarea
            id='question'
            name='question'
            required
            defaultValue={question?.question || ''}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Escribe tu pregunta aquí...'
          />
        </div>

        {/* Feedback Field */}
        <div>
          <label htmlFor='feedback' className='block text-sm font-medium text-gray-700 mb-2'>
            Retroalimentación
          </label>
          <textarea
            id='feedback'
            name='feedback'
            defaultValue={question?.feedback || ''}
            rows={2}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Retroalimentación opcional...'
          />
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-2'>
            Estado
          </label>
          <select
            id='status'
            name='status'
            defaultValue={question?.status || 'AVAILABLE'}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value='AVAILABLE'>Disponible</option>
            <option value='UNAVAILABLE'>No disponible</option>
          </select>
        </div>

        {/* Answers Section */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>Respuestas *</label>
          <div className='space-y-3'>
            {answers.map((answer, index) => (
              <div key={index} className='flex items-center space-x-3 p-3 border border-gray-200 rounded-md'>
                <input
                  type='text'
                  value={answer.value}
                  onChange={(e) => updateAnswer(index, 'value', e.target.value)}
                  placeholder={`Respuesta ${index + 1}`}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={answer.isCorrect}
                    onChange={(e) => updateAnswer(index, 'isCorrect', e.target.checked)}
                    className='mr-2'
                  />
                  <span className='text-sm text-gray-600'>Correcta</span>
                </label>
                {answers.length > 1 && (
                  <button
                    type='button'
                    onClick={() => removeAnswer(index)}
                    className='text-red-600 hover:text-red-800 p-1'
                  >
                    <TrashIcon className='w-5 h-5' />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type='button'
            onClick={addAnswer}
            className='mt-3 flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium'
          >
            <PlusIcon className='w-4 h-4 mr-1' />
            Agregar respuesta
          </button>
        </div>

        {/* Form Actions */}
        <div className='flex justify-end space-x-3 pt-6 border-t'>
          <button
            type='button'
            onClick={onClose}
            disabled={updateQuestionMutation.isPending}
            className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50'
          >
            Cancelar
          </button>
          <button
            type='submit'
            disabled={updateQuestionMutation.isPending}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors'
          >
            {updateQuestionMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditQuestionModal
