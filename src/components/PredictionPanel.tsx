import type { Prediction } from '../predict/types'
import './PredictionPanel.css'

interface PredictionToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function PredictionToggle({ enabled, onChange }: PredictionToggleProps) {
  return (
    <label className="predict-toggle">
      <input type="checkbox" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
      Think Like the Algorithm
    </label>
  )
}

interface PredictionPanelProps {
  prediction: Prediction
  selectedOptionId: string | null
  onSelect: (optionId: string) => void
  onContinue: () => void
}

export function PredictionPanel({ prediction, selectedOptionId, onSelect, onContinue }: PredictionPanelProps) {
  const answered = selectedOptionId !== null
  const isCorrect = selectedOptionId === prediction.correctOptionId

  return (
    <div className="prediction-panel">
      <p className="prediction-prompt">{prediction.prompt}</p>
      <div className="prediction-options">
        {prediction.options.map((option) => {
          const isSelected = option.id === selectedOptionId
          const isCorrectOption = option.id === prediction.correctOptionId
          const state = !answered ? '' : isCorrectOption ? 'correct' : isSelected ? 'incorrect' : ''

          return (
            <button
              key={option.id}
              type="button"
              className={`prediction-option ${state}`}
              disabled={answered}
              onClick={() => onSelect(option.id)}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="prediction-feedback">
          <p>{isCorrect ? '✓ Correct!' : '✗ Not quite.'}</p>
          <p>{prediction.explanation}</p>
          <button type="button" onClick={onContinue}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
