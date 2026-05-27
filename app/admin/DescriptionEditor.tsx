'use client'

import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

interface DescriptionEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function DescriptionEditor({ value, onChange }: DescriptionEditorProps) {
  return (
    <ReactQuill
      value={value}
      onChange={onChange}
      theme="snow"
      placeholder="Describe brevemente qué hace tu app..."
      modules={{
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link']
        ]
      }}
    />
  )
}
