import './ShowValuesToggle.css'

interface ShowValuesToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
}

export function ShowValuesToggle({ enabled, onChange }: ShowValuesToggleProps) {
  return (
    <label className="show-values-toggle">
      <input type="checkbox" checked={enabled} onChange={(e) => onChange(e.target.checked)} />
      Show values on bars
    </label>
  )
}
