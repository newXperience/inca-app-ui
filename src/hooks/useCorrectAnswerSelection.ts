import { useCallback, useState } from 'react'

import { type UseFormSetValue, type UseFormTrigger } from 'react-hook-form'

import { type QuestionFormData } from './useQuestionForm'

/**
 * Custom hook for managing correct answer selection state
 */
export const useCorrectAnswerSelection = (
  answersLength: number,
  setValue: UseFormSetValue<QuestionFormData>,
  trigger: UseFormTrigger<QuestionFormData>
) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  /**
   * Select a correct answer and update form state atomically
   * Ensures exactly one answer is marked as correct
   */
  const selectCorrectAnswer = useCallback(
    (index: number) => {
      if (index >= 0 && index < answersLength) {
        setSelectedIndex(index)

        // Update all answers atomically to ensure exactly one is correct
        for (let i = 0; i < answersLength; i++) {
          setValue(`answers.${i}.isCorrect`, i === index, {
            shouldValidate: true,
            shouldDirty: true,
          })
        }

        trigger('answers')
      }
    },
    [answersLength, setValue, trigger]
  )

  /**
   * Initialize selection based on existing form data
   */
  const initializeSelection = useCallback(
    (answers: Array<{ isCorrect: boolean }>) => {
      const correctIndex = answers.findIndex((answer) => answer.isCorrect)
      const indexToSelect = correctIndex >= 0 ? correctIndex : 0

      if (indexToSelect !== selectedIndex) {
        setSelectedIndex(indexToSelect)
        selectCorrectAnswer(indexToSelect)
      } else if (correctIndex < 0) {
        selectCorrectAnswer(indexToSelect)
      }
    },
    [selectedIndex, selectCorrectAnswer]
  )

  /**
   * Adjust selection when answers are removed
   */
  const handleAnswerRemoval = useCallback(
    (removedIndex: number, newLength: number) => {
      if (selectedIndex === removedIndex) {
        // If removing selected answer, select the first available
        const newIndex = Math.min(0, newLength - 1)
        selectCorrectAnswer(newIndex)
      } else if (selectedIndex > removedIndex) {
        // Adjust index if removing an answer before the selected one
        const adjustedIndex = selectedIndex - 1
        setSelectedIndex(adjustedIndex)
        selectCorrectAnswer(adjustedIndex)
      }
    },
    [selectedIndex, selectCorrectAnswer]
  )

  return {
    selectedIndex,
    selectCorrectAnswer,
    initializeSelection,
    handleAnswerRemoval,
  }
}
