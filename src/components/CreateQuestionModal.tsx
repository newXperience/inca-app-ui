import { useEffect } from 'react'

import { TrashIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { type SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useCreateQuestion } from '../hooks/useQuestions'

import Modal from './Modal'

interface CreateQuestionModalProps {
  isOpen: boolean
  onClose: () => void
}

const createQuestionSchema = z.object({
  question: z.string().min(1, 'La pregunta es requerida'),
  feedback: z.string().optional(),
  answers: z.array(
    z.object({
      value: z.string().min(1, 'La respuesta es requerida'),
      isCorrect: z.boolean(),
    })
  ),
})

type CreateQuestionForm = z.infer<typeof createQuestionSchema>

const CreateQuestionModal = ({ isOpen, onClose }: CreateQuestionModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<CreateQuestionForm>({
    mode: 'all',
    resolver: zodResolver(createQuestionSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'answers',
  })

  const createQuestionMutation = useCreateQuestion()

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  const onSubmit: SubmitHandler<CreateQuestionForm> = (data: CreateQuestionForm) => {
    createQuestionMutation.mutate(
      { ...data, status: 'AVAILABLE' },
      {
        onSuccess: () => {
          onClose()
        },
        onSettled: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Crear Pregunta' size='lg'>
      <div>
        <label htmlFor='question' className='block text-sm font-medium text-gray-700 mb-2'>
          Pregunta *
        </label>
        <textarea
          id='question'
          {...register('question')}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Escribe tu pregunta aquí...'
        />
        {errors.question && <p className='text-red-500 text-sm mt-1'>{errors.question.message}</p>}
      </div>

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
        />
      </div>

      <div>
        <label htmlFor='answers' className='block text-sm font-medium text-gray-700 mb-2'>
          Respuestas *
        </label>
        <button type='button' onClick={() => append({ value: '', isCorrect: false })}>
          Agregar respuesta
        </button>
        <div className='space-y-3'>
          {fields.map((answer, index) => (
            <div key={answer.id}>
              <div key={index} className='flex items-center space-x-3 p-3 border border-gray-200 rounded-md'>
                <input
                  type='text'
                  {...register(`answers.${index}.value`)}
                  placeholder={`Respuesta ${index + 1}`}
                  className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                  required
                />
                {errors.answers?.[index]?.value && (
                  <p className='text-red-500 text-sm mt-1'>{errors.answers?.[index]?.value?.message}</p>
                )}
                <label className='flex items-center'>
                  <input type='checkbox' {...register(`answers.${index}.isCorrect`)} className='mr-2' />
                  <span className='text-sm text-gray-600'>Correcta</span>
                </label>
                {fields.length > 1 && (
                  <button type='button' onClick={() => remove(index)} className='text-red-600 hover:text-red-800 p-1'>
                    <TrashIcon className='w-5 h-5' />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-end space-x-3 pt-6 border-t'>
        <button
          type='button'
          onClick={onClose}
          disabled={createQuestionMutation.isPending}
          className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50'
        >
          Cancelar
        </button>
        <button
          type='button'
          onClick={handleSubmit(onSubmit)}
          disabled={createQuestionMutation.isPending}
          className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors'
        >
          {createQuestionMutation.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </Modal>
  )
}

export default CreateQuestionModal
