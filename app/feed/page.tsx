'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdateFeedItem from '@/app/components/UpdateFeedItem'
import { createClient } from '@/lib/supabase'
import './feed.css'

interface Update {
  id: string
  title: string
  content: string
  likes_count: number
  created_at: string
  app: {
    id: string
    title: string
    image_url?: string
  }
  author: {
    id: string
    display_name: string
    username: string
    avatar_url?: string
  }
  liked_by_user: boolean
}

export default function FeedPage() {
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth')
          return
        }

        setCurrentUserId(user.id)

        const response = await fetch('/api/feed?limit=20')
        if (!response.ok) throw new Error('Failed to fetch feed')

        const data = await response.json()
        setUpdates(data)
      } catch (error) {
        console.error('Fetch feed error:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeed()
  }, [router])

  if (isLoading) {
    return (
      <div className="ag-feed-container">
        <div className="ag-loading">Loading feed...</div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="ag-feed-container">
        <div className="ag-error">Failed to load feed. Please try again.</div>
      </div>
    )
  }

  if (updates.length === 0) {
    return (
      <div className="ag-feed-container">
        <div className="ag-empty-state">
          <h2>No updates yet</h2>
          <p>Follow builders to see their latest updates</p>
          <a href="/builders" className="ag-button-primary">
            Explore Builders
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="ag-feed-container">
      <div className="ag-feed-header">
        <h1>Feed</h1>
        <p>Updates from builders you follow</p>
      </div>

      <div className="ag-feed-list">
        {updates.map(update => (
          <UpdateFeedItem
            key={update.id}
            {...update}
            currentUserId={currentUserId || undefined}
          />
        ))}
      </div>
    </div>
  )
}
