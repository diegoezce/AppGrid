'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/i18n/useLanguage'

interface FollowButtonProps {
  userId: string
  currentUserId: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export default function FollowButton({
  userId,
  currentUserId,
  isFollowing: initialIsFollowing,
  onFollowChange
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()
  const router = useRouter()

  const handleToggleFollow = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        const response = await fetch(
          `/api/follows?follower_id=${currentUserId}&following_id=${userId}`,
          { method: 'DELETE' }
        )
        if (!response.ok) throw new Error('Failed to unfollow')
      } else {
        const response = await fetch('/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ follower_id: currentUserId, following_id: userId })
        })
        if (!response.ok) throw new Error('Failed to follow')
      }

      const newIsFollowing = !isFollowing
      setIsFollowing(newIsFollowing)
      onFollowChange?.(newIsFollowing)
      router.refresh()
    } catch (error) {
      console.error('Toggle follow error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggleFollow}
      disabled={isLoading}
      className={`ag-follow-button ${isFollowing ? 'following' : ''}`}
    >
      {isLoading ? t('follow.loading') : isFollowing ? t('follow.unfollow') : t('follow.follow')}
    </button>
  )
}
