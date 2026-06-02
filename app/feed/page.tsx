'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UpdateFeedItem from '@/app/components/UpdateFeedItem'
import Navigation from '@/app/components/Navigation'
import PostComposer from '@/app/components/PostComposer'
import { supabase } from '@/lib/supabase'
import { useLanguage } from '@/app/i18n/useLanguage'
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
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const { t } = useLanguage()
  const router = useRouter()

  const fetchFeed = async (userId: string) => {
    try {
      const response = await fetch(`/api/feed?user_id=${userId}&limit=20`)
      if (!response.ok) throw new Error('Failed to fetch feed')
      setUpdates(await response.json())
    } catch (error) {
      console.error('Fetch feed error:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user) {
          router.push('/auth?redirect=/feed')
          return
        }
        setCurrentUserId(session.user.id)

        // Mark feed as seen and notify nav to clear badge
        localStorage.setItem('ag_feed_last_seen', new Date().toISOString())
        window.dispatchEvent(new Event('feed-visited'))

        const { data: profile } = await supabase
          .from('users')
          .select('username')
          .eq('id', session.user.id)
          .maybeSingle()
        if (profile?.username) setCurrentUsername(profile.username)

        await fetchFeed(session.user.id)
      } catch (error) {
        console.error('Fetch feed error:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }
    init()
  }, [router])

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="ag-feed-container">
          <div className="ag-loading">{t('feed.loading')}</div>
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Navigation />
        <div className="ag-feed-container">
          <div className="ag-error">{t('feed.error')}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
      <div className="ag-feed-container">
        <div className="ag-feed-header">
          <h1>Feed</h1>
          <p>{t('feed.subtitle')}</p>
        </div>

        {currentUserId && (
          <PostComposer
            userId={currentUserId}
            username={currentUsername}
            onPosted={newUpdate => setUpdates(prev => [newUpdate, ...prev])}
          />
        )}

        {updates.length === 0 ? (
          <div className="ag-empty-state">
            <h2>{t('feed.emptyTitle')}</h2>
            <p>{t('feed.emptyDesc')}</p>
            <a href="/builders" className="ag-button-primary">{t('feed.exploreBuilders')}</a>
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
    </>
  )
}
