'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/app/i18n/useLanguage'

interface Comment {
  id: string
  content: string
  created_at: string
  user: { id: string; display_name: string; username: string; avatar_url?: string }
}

interface UpdateFeedItemProps {
  id: string
  title: string
  content: string
  likes_count: number
  created_at: string
  liked_by_user?: boolean
  app: { id: string; title: string; image_url?: string } | null
  author: { id: string; display_name: string; username: string; avatar_url?: string } | null
  currentUserId?: string
}

function formatTime(timestamp: string, t: (key: string) => string): string {
  const diffMs = Date.now() - new Date(timestamp).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return t('comments.justNow')
  if (diffMins < 60) return `${diffMins}${t('comments.minutesAgo')}`
  if (diffHours < 24) return `${diffHours}${t('comments.hoursAgo')}`
  if (diffDays < 7) return `${diffDays}${t('comments.daysAgo')}`
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
  const [isLikeLoading, setIsLikeLoading] = useState(false)

  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentsLoaded, setCommentsLoaded] = useState(false)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const { t } = useLanguage()
  const router = useRouter()

  const handleToggleLike = async () => {
    if (!currentUserId) {
      router.push('/auth')
      return
    }

    setIsLikeLoading(true)
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
      setIsLikeLoading(false)
    }
  }

  const handleToggleComments = async () => {
    if (!showComments && !commentsLoaded) {
      setCommentsLoading(true)
      try {
        const res = await fetch(`/api/updates/${id}/comments`)
        if (!res.ok) throw new Error('Failed to fetch comments')
        setComments(await res.json())
        setCommentsLoaded(true)
      } catch (error) {
        console.error('Fetch comments error:', error)
      } finally {
        setCommentsLoading(false)
      }
    }
    setShowComments(prev => !prev)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) {
      router.push('/auth')
      return
    }
    if (!commentText.trim()) return

    setIsSubmitting(true)
    setCommentError(null)
    try {
      const res = await fetch(`/api/updates/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId, content: commentText })
      })
      const data = await res.json()
      if (!res.ok) {
        setCommentError(data.error ?? t('comments.error'))
        return
      }
      setComments(prev => [...prev, data])
      setCommentText('')
    } catch (error) {
      console.error('Post comment error:', error)
      setCommentError(t('comments.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const res = await fetch(`/api/updates/${id}/comments?comment_id=${commentId}&user_id=${currentUserId}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Failed to delete comment')
      setComments(prev => prev.filter(c => c.id !== commentId))
    } catch (error) {
      console.error('Delete comment error:', error)
    }
  }

  if (!app || !author) return null

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
        <span className="ag-feed-timestamp">{formatTime(created_at, t)}</span>
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
          disabled={isLikeLoading}
          className={`ag-like-button ${isLiked ? 'liked' : ''}`}
        >
          <svg className="ag-action-icon" viewBox="0 0 24 24" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className={`ag-comment-button ${showComments ? 'active' : ''}`}
        >
          <svg className="ag-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span>{comments.length > 0 ? comments.length : ''}</span>
        </button>
      </div>

      {showComments && (
        <div className="ag-comments-section">
          {commentsLoading ? (
            <p className="ag-comments-loading">{t('comments.loading')}</p>
          ) : (
            <>
              {comments.length === 0 && (
                <p className="ag-comments-empty">{t('comments.empty')}</p>
              )}
              <div className="ag-comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="ag-comment">
                    <Link href={`/builders/${comment.user.username}`} className="ag-comment-author">
                      {comment.user.avatar_url && (
                        <img src={comment.user.avatar_url} alt={comment.user.display_name} className="ag-comment-avatar" />
                      )}
                      <span className="ag-comment-name">{comment.user.display_name}</span>
                    </Link>
                    <p className="ag-comment-content">{comment.content}</p>
                    <div className="ag-comment-meta">
                      <span className="ag-comment-time">{formatTime(comment.created_at, t)}</span>
                      {currentUserId === comment.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ag-comment-delete"
                        >
                          {t('comments.delete')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {currentUserId ? (
                <>
                  {commentError && (
                    <p className="ag-comment-error">{commentError}</p>
                  )}
                  <form onSubmit={handleSubmitComment} className="ag-comment-form">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder={t('comments.placeholder')}
                    maxLength={500}
                    className="ag-comment-input"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !commentText.trim()}
                    className="ag-comment-submit"
                  >
                    {isSubmitting ? '...' : t('comments.send')}
                  </button>
                  </form>
                </>
              ) : (
                <p className="ag-comments-login">
                  <Link href="/auth">{t('comments.loginLink')}</Link> {t('comments.loginSuffix')}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </article>
  )
}
