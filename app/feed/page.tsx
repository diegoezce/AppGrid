'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdateFeedItem from '@/app/components/UpdateFeedItem'
import { supabase } from '@/lib/supabase'
import './feed.css'

interface Update {
  id: string
  title: string
  content: string
  likes_count: number
  created_at: string
  app: { id: string; title: string; image_url?: string }
  author: { id: string; display_name: string; username: string; avatar_url?: string }
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
        const { data: { session } } = await supabase.auth.getSession()

        if (!session?.user) {
          router.push('/auth')
          return
        }

        setCurrentUserId(session.user.id)

        const response = await fetch(`/api/feed?user_id=${session.user.id}&limit=20`)
        if (!response.ok) throw new Error('Failed to fetch feed')

        setUpdates(await response.json())
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

  return (
    <div className="ag-feed-container">
      <div className="ag-feed-header">
        <h1>Feed</h1>
        <p>Updates from builders you follow</p>
      </div>

      {updates.length === 0 ? (
        <div className="ag-empty-state">
          <h2>No updates yet</h2>
          <p>Follow builders to see their latest updates</p>
          <a href="/builders" className="ag-button-primary">Explore Builders</a>
        </div>
      ) : (
        <div className="ag-feed-list">
          {updates.map(update => (
            <UpdateFeedItem
              key={update.id}
              {...update}
              currentUserId={currentUserId || undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
