import './ExplanationPanel.css'

interface ExplanationToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function ExplanationToggle({ enabled, onChange }: ExplanationToggleProps) {
  return (
    <label className="explanation-toggle">
      <input type="checkbox" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
      Explain this step
    </label>
  )
}

interface ExplanationPanelProps {
  text: string
}

export function ExplanationPanel({ text }: ExplanationPanelProps) {
  return (
    <div className="explanation-panel">
      <p>{text}</p>
    </div>
  )
}
