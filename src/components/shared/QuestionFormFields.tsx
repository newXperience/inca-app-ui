import { type FieldErrors, type UseFormRegister } from 'react-hook-form'

import { type QuestionFormData } from '../../hooks/useQuestionForm'

interface QuestionFormFieldsProps {
  register: UseFormRegister<QuestionFormData>
  errors: FieldErrors<QuestionFormData>
  showStatus?: boolean
  defaultValues?: {
    question?: string
    feedback?: string
    status?: 'AVAILABLE' | 'DELETED'
  }
}

const QuestionFormFields = ({ register, errors, showStatus = false, defaultValues }: QuestionFormFieldsProps) => {
  return (
    <div className='space-y-6'>
      {/* Question Field */}
      <div>
        <label htmlFor='question' className='block text-sm font-medium text-gray-700 mb-2'>
          Pregunta *
        </label>
        <textarea
          id='question'
          {...register('question', { required: 'La pregunta es requerida' })}
          rows={3}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Escribe tu pregunta aquí...'
          defaultValue={defaultValues?.question || ''}
        />
        {errors.question && (
          <p className='text-red-500 text-sm mt-1'>{String(errors.question?.message || 'Error en la pregunta')}</p>
        )}
      </div>

      {/* Feedback Field */}
      <div>
        <label htmlFor='feedback' className='block text-sm font-medium text-gray-700 mb-2'>
          Retroalimentación
        </label>
        <textarea
          id='feedback'
          {...register('feedback')}
          rows={2}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Retroalimentación opcional...'
          defaultValue={defaultValues?.feedback || ''}
        />
        {errors.feedback && (
          <p className='text-red-500 text-sm mt-1'>
            {String(errors.feedback?.message || 'Error en la retroalimentación')}
          </p>
        )}
      </div>

      {/* Status Field - Only shown in edit mode */}
      {showStatus && (
        <div>
          <label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-2'>
            Estado
          </label>
          <select
            id='status'
            {...register('status')}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            defaultValue={defaultValues?.status || 'AVAILABLE'}
          >
            <option value='AVAILABLE'>Disponible</option>
            <option value='DELETED'>No disponible</option>
          </select>
          {errors.status && (
            <p className='text-red-500 text-sm mt-1'>{String(errors.status?.message || 'Error en el estado')}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default QuestionFormFields
