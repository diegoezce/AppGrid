'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import FollowButton from '@/app/components/FollowButton'
import BuilderStats from '@/app/components/BuilderStats'
import UpdateFeedItem from '@/app/components/UpdateFeedItem'
import { createClient } from '@/lib/supabase'
import './builder-profile.css'

interface Builder {
  id: string
  display_name: string
  username: string
  bio: string | null
  avatar_url: string | null
  followers_count: number
  following_count: number
  apps_count: number
  is_following: boolean
  is_own_profile: boolean
}

interface App {
  id: string
  title: string
  image_url?: string
}

interface Update {
  id: string
  title: string
  content: string
  likes_count: number
  created_at: string
  app: App
  author: any
  liked_by_user: boolean
}

export default function BuilderProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [builder, setBuilder] = useState<Builder | null>(null)
  const [apps, setApps] = useState<App[]>([])
  const [updates, setUpdates] = useState<Update[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [activeTab, setActiveTab] = useState<'apps' | 'updates'>('apps')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchBuilder = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)

        // Get builder
        const builderRes = await fetch(`/api/builders/${username}`)
        if (!builderRes.ok) throw new Error('Builder not found')
        const builderData = await builderRes.json()
        setBuilder(builderData)

        // Get builder's apps
        const appsRes = await fetch(`/api/apps?user_id=${builderData.id}`)
        if (appsRes.ok) {
          const appsData = await appsRes.json()
          setApps(appsData)
        }

        // Get builder's updates
        const updatesRes = await fetch(`/api/updates?user_id=${builderData.id}`)
        if (updatesRes.ok) {
          const updatesData = await updatesRes.json()
          setUpdates(updatesData)
        }
      } catch (error) {
        console.error('Fetch builder error:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (username) {
      fetchBuilder()
    }
  }, [username])

  if (isLoading) {
    return (
      <div className="ag-builder-profile-container">
        <div className="ag-loading">Loading profile...</div>
      </div>
    )
  }

  if (hasError || !builder) {
    return (
      <div className="ag-builder-profile-container">
        <div className="ag-error">Builder not found</div>
        <Link href="/builders" className="ag-back-link">
          ← Back to Builders
        </Link>
      </div>
    )
  }

  return (
    <div className="ag-builder-profile-container">
      <Link href="/builders" className="ag-back-link">
        ← Builders
      </Link>

      <div className="ag-builder-profile-header">
        {builder.avatar_url && (
          <img
            src={builder.avatar_url}
            alt={builder.display_name}
            className="ag-builder-profile-avatar"
          />
        )}
        <div className="ag-builder-profile-info">
          <h1>{builder.display_name || builder.username}</h1>
          <p className="ag-builder-profile-username">@{builder.username}</p>
          {builder.bio && <p className="ag-builder-profile-bio">{builder.bio}</p>}
        </div>

        {!builder.is_own_profile && currentUserId && (
          <div className="ag-builder-profile-action">
            <FollowButton
              userId={builder.id}
              isFollowing={builder.is_following}
            />
          </div>
        )}
      </div>

      <BuilderStats
        apps_count={builder.apps_count}
        followers_count={builder.followers_count}
        following_count={builder.following_count}
      />

      <div className="ag-builder-profile-tabs">
        <button
          className={activeTab === 'apps' ? 'active' : ''}
          onClick={() => setActiveTab('apps')}
        >
          Apps ({apps.length})
        </button>
        <button
          className={activeTab === 'updates' ? 'active' : ''}
          onClick={() => setActiveTab('updates')}
        >
          Updates ({updates.length})
        </button>
      </div>

      {activeTab === 'apps' && (
        <div className="ag-builder-apps">
          {apps.length === 0 ? (
            <p className="ag-empty-message">No apps yet</p>
          ) : (
            <div className="ag-apps-grid">
              {apps.map(app => (
                <Link
                  key={app.id}
                  href={`/marketplace/${app.id}`}
                  className="ag-app-card"
                >
                  {app.image_url && (
                    <img src={app.image_url} alt={app.title} />
                  )}
                  <h3>{app.title}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="ag-builder-updates">
          {updates.length === 0 ? (
            <p className="ag-empty-message">No updates yet</p>
          ) : (
            <div className="ag-updates-list">
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
      )}
    </div>
  )
}
