'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UpdateFeedItemProps {
  id: string
  title: string
  content: string
  likes_count: number
  created_at: string
  liked_by_user?: boolean
  app: { id: string; title: string; image_url?: string }
  author: { id: string; display_name: string; username: string; avatar_url?: string }
  currentUserId?: string
}

function formatTime(timestamp: string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export default function UpdateFeedItem({
  id,
  title,
  content,
  likes_count,
  created_at,
  liked_by_user = false,
  app,
  author,
  currentUserId
}: UpdateFeedItemProps) {
  const [isLiked, setIsLiked] = useState(liked_by_user)
  const [likesCount, setLikesCount] = useState(likes_count)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggleLike = async () => {
    if (!currentUserId) {
      router.push('/auth')
      return
    }

    setIsLoading(true)
    try {
      if (isLiked) {
        const response = await fetch(`/api/updates/${id}/like?user_id=${currentUserId}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to unlike')
        setIsLiked(false)
        setLikesCount(Math.max(0, likesCount - 1))
      } else {
        const response = await fetch(`/api/updates/${id}/like`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUserId })
        })
        if (!response.ok) throw new Error('Failed to like')
        setIsLiked(true)
        setLikesCount(likesCount + 1)
      }
    } catch (error) {
      console.error('Toggle like error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <article className="ag-feed-item">
      <div className="ag-feed-item-header">
        <Link href={`/builders/${author.username}`} className="ag-author-info">
          {author.avatar_url && (
            <img src={author.avatar_url} alt={author.display_name} className="ag-feed-avatar" />
          )}
          <div className="ag-author-details">
            <p className="ag-author-name">{author.display_name}</p>
            <p className="ag-author-username">@{author.username}</p>
          </div>
        </Link>
        <span className="ag-feed-timestamp">{formatTime(created_at)}</span>
      </div>

      <div className="ag-feed-item-content">
        <Link href={`/marketplace/${app.id}`} className="ag-app-link">
          <p className="ag-app-name">{app.title}</p>
        </Link>
        <h4 className="ag-update-title">{title}</h4>
        <p className="ag-update-content">{content}</p>
      </div>

      <div className="ag-feed-item-footer">
        <button
          onClick={handleToggleLike}
          disabled={isLoading}
          className={`ag-like-button ${isLiked ? 'liked' : ''}`}
        >
          <span className="ag-like-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="ag-like-count">{likesCount}</span>
        </button>
      </div>
    </article>
  )
}
