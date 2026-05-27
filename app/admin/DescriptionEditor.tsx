'use client'

interface DescriptionEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function DescriptionEditor({ value, onChange }: DescriptionEditorProps) {
  return (
    <textarea
      placeholder="Describe brevemente qué hace tu app..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="ag-textarea"
      required
      style={{ minHeight: '150px' }}
    />
  )
}

