import { toast } from 'sonner'

import { type QuestionFormData } from './useQuestionForm'
import { type QuestionRequest, type QuestionResponse, useCreateQuestion, useUpdateQuestion } from './useQuestions'

interface UseQuestionMutationProps {
  mode: 'create' | 'edit'
  question?: QuestionResponse
  onSuccess?: () => void
}

export const useQuestionMutation = ({ mode, question, onSuccess }: UseQuestionMutationProps) => {
  const createMutation = useCreateQuestion()
  const updateMutation = useUpdateQuestion()

  const mutation = mode === 'edit' ? updateMutation : createMutation

  const submitQuestion = (formData: QuestionFormData) => {
    // Transform form data to API format
    const requestData: QuestionRequest = {
      question: formData.question.trim(),
      feedback: formData.feedback?.trim() || '',
      status: formData.status || 'AVAILABLE',
      answers: formData.answers.map((answer) => ({
        value: answer.value.trim(),
        isCorrect: answer.isCorrect,
      })),
    }

    // Validate that we have at least one correct answer
    const hasCorrectAnswer = requestData.answers.some((answer) => answer.isCorrect)
    if (!hasCorrectAnswer) {
      toast.error('Debe haber al menos una respuesta correcta')
      return
    }

    // Validate that all answers have text
    const hasEmptyAnswers = requestData.answers.some((answer) => !answer.value.trim())
    if (hasEmptyAnswers) {
      toast.error('Todas las respuestas deben tener texto')
      return
    }

    if (mode === 'edit') {
      if (!question?.id) {
        toast.error('ID de pregunta no válido')
        return
      }

      updateMutation.mutate(
        { id: question.id, data: requestData },
        {
          onSuccess: () => {
            toast.success('Pregunta actualizada exitosamente')
            onSuccess?.()
          },
          onError: (error) => {
            console.error('Error updating question:', error)
            toast.error('Error al actualizar la pregunta')
          },
        }
      )
    } else {
      createMutation.mutate(requestData, {
        onSuccess: () => {
          toast.success('Pregunta creada exitosamente')
          onSuccess?.()
        },
        onError: (error) => {
          console.error('Error creating question:', error)
          toast.error('Error al crear la pregunta')
        },
      })
    }
  }

  return {
    submitQuestion,
    isLoading: mutation.isPending,
    error: mutation.error,
  }
}
