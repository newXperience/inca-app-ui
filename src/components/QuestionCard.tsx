import {
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

import { type QuestionResponse } from '../hooks/useQuestions'

interface QuestionCardProps {
  question: QuestionResponse
  // eslint-disable-next-line no-unused-vars
  onEdit: (question: QuestionResponse) => void
  // eslint-disable-next-line no-unused-vars
  onDelete: (question: QuestionResponse) => void
}

const QuestionCard = ({ question, onEdit, onDelete }: QuestionCardProps) => {
  const correctAnswersCount = question.answers.filter((answer) => answer.is_correct).length
  const totalAnswers = question.answers.length

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4 hover:shadow-md transition-shadow'>
      {/* Question Header */}
      <div className='flex justify-between items-start space-x-3'>
        <div className='flex-1 space-y-2'>
          <div className='flex items-center space-x-2'>
            <span className='text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded'>#{question.id}</span>
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                question.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <span className='flex items-center space-x-1'>
                {question.status === 'AVAILABLE' ? (
                  <>
                    <CheckIcon className='w-3 h-3' />
                    <span>Disponible</span>
                  </>
                ) : (
                  <>
                    <XMarkIcon className='w-3 h-3' />
                    <span>No disponible</span>
                  </>
                )}
              </span>
            </span>
          </div>
          <h3
            className='font-medium text-gray-900 leading-tight overflow-hidden'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {question.question}
          </h3>
          {question.feedback && (
            <div
              className='text-sm text-gray-500 italic overflow-hidden flex items-start space-x-1'
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              <LightBulbIcon className='w-4 h-4 flex-shrink-0 mt-0.5' />
              <span className='flex-1'>{question.feedback}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-2 flex-shrink-0'>
          <button
            onClick={() => onEdit(question)}
            className='p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors'
            title='Editar pregunta'
          >
            <PencilSquareIcon className='w-5 h-5' />
          </button>
          <button
            onClick={() => onDelete(question)}
            className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors'
            title='Eliminar pregunta'
          >
            <TrashIcon className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Answers Summary */}
      <div className='space-y-3'>
        <div className='flex items-center justify-between'>
          <h4 className='text-sm font-medium text-gray-700'>Respuestas</h4>
          <div className='text-xs text-gray-500'>
            {correctAnswersCount} correcta{correctAnswersCount !== 1 ? 's' : ''} de {totalAnswers}
          </div>
        </div>

        {/* Answers Preview */}
        <div className='space-y-2'>
          {question.answers.slice(0, 2).map((answer) => (
            <div key={answer.id} className='flex items-center space-x-2 text-sm'>
              {answer.is_correct ? (
                <CheckCircleIcon className='w-4 h-4 text-green-500 flex-shrink-0' />
              ) : (
                <ExclamationTriangleIcon className='w-4 h-4 text-gray-400 flex-shrink-0' />
              )}
              <span className='text-gray-700 truncate flex-1' title={answer.answer}>
                {answer.answer}
              </span>
              {answer.is_correct && (
                <span className='bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex-shrink-0'>
                  Correcta
                </span>
              )}
            </div>
          ))}

          {totalAnswers > 2 && (
            <div className='text-xs text-gray-500 italic pl-6'>
              +{totalAnswers - 2} respuesta{totalAnswers - 2 > 1 ? 's' : ''} más
            </div>
          )}
        </div>
      </div>

      {/* Answer Stats */}
      <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
        <div className='flex items-center space-x-4 text-xs text-gray-500'>
          <span className='flex items-center space-x-1'>
            <CheckCircleIcon className='w-3 h-3 text-green-500' />
            <span>
              {correctAnswersCount} correcta{correctAnswersCount !== 1 ? 's' : ''}
            </span>
          </span>
          <span className='flex items-center space-x-1'>
            <ExclamationTriangleIcon className='w-3 h-3 text-gray-400' />
            <span>
              {totalAnswers - correctAnswersCount} incorrecta{totalAnswers - correctAnswersCount !== 1 ? 's' : ''}
            </span>
          </span>
        </div>
        <div className='text-xs text-gray-500'>
          Total: {totalAnswers} respuesta{totalAnswers !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
