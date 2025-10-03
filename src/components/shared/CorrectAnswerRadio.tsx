/**
 * CorrectAnswerRadio Component
 *
 * Follows Single Responsibility Principle - only handles radio button rendering
 * Reusable component for selecting correct answers with proper accessibility
 */

interface CorrectAnswerRadioProps {
  index: number
  isSelected: boolean
  // eslint-disable-next-line no-unused-vars
  onSelect: (index: number) => void
  disabled?: boolean
  label?: string
}

const CorrectAnswerRadio = ({
  index,
  isSelected,
  onSelect,
  disabled = false,
  label = 'Correcta',
}: CorrectAnswerRadioProps) => {
  return (
    <label className='flex items-center cursor-pointer'>
      <input
        type='radio'
        name='correctAnswer' // Shared name ensures mutual exclusion
        checked={isSelected}
        onChange={() => onSelect(index)}
        disabled={disabled}
        className='mr-2 text-blue-600 focus:ring-blue-500 focus:ring-2'
        aria-label={`Marcar respuesta ${index + 1} como correcta`}
      />
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
    </label>
  )
}

export default CorrectAnswerRadio
