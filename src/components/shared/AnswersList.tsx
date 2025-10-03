import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { type Control, type FieldErrors, useFieldArray, type UseFormRegister } from 'react-hook-form'

import { type QuestionFormData } from '../../hooks/useQuestionForm'

interface AnswersListProps {
  register: UseFormRegister<QuestionFormData>
  control: Control<QuestionFormData>
  errors: FieldErrors<QuestionFormData>
}

const AnswersList = ({ register, control, errors }: AnswersListProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  const addAnswer = () => {
    append({ value: '', isCorrect: false })
  }

  const removeAnswer = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>Respuestas *</label>

      <div className='space-y-3'>
        {fields.map((field, index) => (
          <div key={field.id} className='flex items-center space-x-3 p-3 border border-gray-200 rounded-md'>
            <div className='flex-1'>
              <input
                type='text'
                {...register(`answers.${index}.value`, {
                  required: 'La respuesta es requerida',
                  validate: (value) => value.trim() !== '' || 'La respuesta no puede estar vacía',
                })}
                placeholder={`Respuesta ${index + 1}`}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              {Array.isArray(errors.answers) && errors.answers[index]?.value && (
                <p className='text-red-500 text-xs mt-1'>
                  {String((errors.answers[index]?.value as { message?: string })?.message || 'Error en la respuesta')}
                </p>
              )}
            </div>

            <label className='flex items-center'>
              <input type='checkbox' {...register(`answers.${index}.isCorrect`)} className='mr-2' />
              <span className='text-sm text-gray-600'>Correcta</span>
            </label>

            {fields.length > 1 && (
              <button
                type='button'
                onClick={() => removeAnswer(index)}
                className='text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-md transition-colors'
                title='Eliminar respuesta'
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
        className='mt-3 flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors'
      >
        <PlusIcon className='w-4 h-4 mr-1' />
        Agregar respuesta
      </button>

      {/* Global answers validation */}
      {errors.answers && typeof (errors.answers as { message?: string })?.message === 'string' && (
        <p className='text-red-500 text-sm mt-2'>{String((errors.answers as { message?: string })?.message)}</p>
      )}
    </div>
  )
}

export default AnswersList
