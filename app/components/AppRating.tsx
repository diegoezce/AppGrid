'use client'

import { useState } from 'react'

interface AppRatingProps {
  rating: number
  count: number
  appId?: string
  onRate?: (newRating: number, newCount: number) => void
}

export default function AppRating({ rating, count, appId, onRate }: AppRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [voted, setVoted] = useState(() => {
    if (typeof window === 'undefined' || !appId) return false
    return localStorage.getItem(`rated_${appId}`) !== null
  })
  const [submitting, setSubmitting] = useState(false)

  const interactive = !!appId && !!onRate && !voted

  const segmentFill = (index: number): string => {
    const value = hovered !== null ? hovered : rating
    if (index < Math.floor(value)) return '100%'
    if (index === Math.floor(value) && value % 1 > 0) return `${(value % 1) * 100}%`
    return '0%'
  }

  const handleRate = async (value: number) => {
    if (!interactive || submitting || !appId) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/apps/${appId}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value }),
      })
      if (res.ok) {
        const data = await res.json()
        localStorage.setItem(`rated_${appId}`, String(value))
        setVoted(true)
        onRate?.(data.rating, data.rating_count)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="ag-rating">
      <div
        className={`ag-rating-segments ${interactive ? 'ag-rating-interactive' : ''}`}
        onMouseLeave={() => interactive && setHovered(null)}
        title={interactive ? 'Calificá esta app' : `${rating.toFixed(1)} / 5`}
      >
        {[0, 1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="ag-rating-seg"
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onClick={() => interactive && handleRate(i + 1)}
          >
            <div className="ag-rating-fill" style={{ width: segmentFill(i) }} />
          </div>
        ))}
      </div>
      <span className="ag-rating-label">
        {count > 0 ? `${rating.toFixed(1)} · ${count} voto${count !== 1 ? 's' : ''}` : 'Sin calificaciones'}
      </span>
    </div>
  )
}
