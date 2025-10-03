import { FormProvider } from 'react-hook-form'

import { type QuestionFormData, useQuestionForm } from '../hooks/useQuestionForm'
import { useQuestionMutation } from '../hooks/useQuestionMutation'
import { type QuestionResponse } from '../hooks/useQuestions'

import Modal from './Modal'
import AnswersList from './shared/AnswersList'
import ModalActions from './shared/ModalActions'
import QuestionFormFields from './shared/QuestionFormFields'

interface QuestionModalProps {
  isOpen: boolean
  onClose: () => void
  question?: QuestionResponse
}

const QuestionModal = ({ isOpen, onClose, question }: QuestionModalProps) => {
  // Determine mode based on presence of question prop
  const mode = question ? 'edit' : 'create'
  const title = mode === 'edit' ? 'Editar Pregunta' : 'Crear Pregunta'

  // Use centralized form logic
  const form = useQuestionForm({
    isOpen,
    question,
    mode,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    showStatus,
    reset,
  } = form

  // Use unified mutation handling
  const { submitQuestion, isLoading } = useQuestionMutation({
    mode,
    question,
    onSuccess: () => {
      onClose()
      reset()
    },
  })

  // Form submission handler
  const onSubmit = (formData: QuestionFormData) => {
    submitQuestion(formData)
  }

  const handleCancel = () => {
    onClose()
    reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title} size='lg'>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Question, Feedback, and Status Fields */}
          <QuestionFormFields
            register={register}
            errors={errors}
            showStatus={showStatus}
            defaultValues={
              question
                ? {
                    question: question.question,
                    feedback: question.feedback || '',
                    status: question.status,
                  }
                : undefined
            }
          />

          {/* Answers Section */}
          <AnswersList register={register} control={control} errors={errors} />

          {/* Form Actions */}
          <ModalActions
            onCancel={handleCancel}
            isLoading={isLoading}
            submitText={mode === 'edit' ? 'Guardar Cambios' : 'Crear Pregunta'}
            disabled={!isValid}
            submitType='submit'
          />
        </form>
      </FormProvider>
    </Modal>
  )
}

export default QuestionModal
