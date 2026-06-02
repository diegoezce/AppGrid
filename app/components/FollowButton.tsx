'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export default function FollowButton({
  userId,
  isFollowing: initialIsFollowing,
  onFollowChange
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggleFollow = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        const response = await fetch(`/api/follows?following_id=${userId}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to unfollow')
      } else {
        const response = await fetch('/api/follows', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ following_id: userId })
        })
        if (!response.ok) throw new Error('Failed to follow')
      }

      const newIsFollowing = !isFollowing
      setIsFollowing(newIsFollowing)
      onFollowChange?.(newIsFollowing)
      router.refresh()
    } catch (error) {
      console.error('Toggle follow error:', error)
      alert(isFollowing ? 'Failed to unfollow' : 'Failed to follow')
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
      {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  )
}
