import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { type QuestionResponse } from './useQuestions'

// Zod schema for form validation
const questionFormSchema = z.object({
  question: z.string().min(1, 'La pregunta es requerida').trim(),
  feedback: z.string().optional(),
  status: z.enum(['AVAILABLE', 'DELETED']).optional(),
  answers: z
    .array(
      z.object({
        value: z.string().min(1, 'La respuesta es requerida').trim(),
        isCorrect: z.boolean(),
      })
    )
    .min(1, 'Se requiere al menos una respuesta')
    .refine((answers) => answers.filter((answer) => answer.isCorrect).length === 1, {
      message: 'Debe seleccionar exactamente una respuesta como correcta',
    }),
})

export type QuestionFormData = z.infer<typeof questionFormSchema>

interface UseQuestionFormProps {
  isOpen: boolean
  question?: QuestionResponse
  mode: 'create' | 'edit'
}

export const useQuestionForm = ({ isOpen, question, mode }: UseQuestionFormProps) => {
  const form = useForm<QuestionFormData>({
    mode: 'onChange',
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question: '',
      feedback: '',
      status: 'AVAILABLE',
      answers: [{ value: '', isCorrect: false }],
    },
  })

  const { reset } = form

  // Initialize form when modal opens or question changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && question) {
        // Populate form with existing question data
        reset({
          question: question.question || '',
          feedback: question.feedback || '',
          status: question.status || 'AVAILABLE',
          answers:
            question.answers?.length > 0
              ? question.answers.map((ans) => ({
                  value: ans.answer,
                  isCorrect: ans.is_correct,
                }))
              : [{ value: '', isCorrect: false }],
        })
      } else {
        // Reset form for create mode
        reset({
          question: '',
          feedback: '',
          status: 'AVAILABLE',
          answers: [{ value: '', isCorrect: false }],
        })
      }
    }
  }, [isOpen, question, mode, reset])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  return {
    ...form,
    isEditMode: mode === 'edit',
    showStatus: mode === 'edit',
  }
}
