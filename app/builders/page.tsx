'use client'

import { useEffect, useState } from 'react'
import BuilderCard from '@/app/components/BuilderCard'
import { createClient } from '@/lib/supabase'
import './builders.css'

interface Builder {
  id: string
  display_name: string
  username: string
  bio: string | null
  avatar_url: string | null
  followers_count: number
  following_count: number
  apps_count: number
}

export default function BuildersPage() {
  const [builders, setBuilders] = useState<Builder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'followers' | 'apps'>('followers')

  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUserId(user?.id || null)

        const response = await fetch(`/api/builders?sort=${sortBy}&limit=50`)
        if (!response.ok) throw new Error('Failed to fetch builders')

        const data = await response.json()
        setBuilders(data)

        // Get current user's following list
        if (user) {
          const followRes = await fetch(`/api/follows?user_id=${user.id}&type=following`)
          if (followRes.ok) {
            const follows = await followRes.json()
            setFollowingSet(new Set(follows.map(f => f.following_id)))
          }
        }
      } catch (error) {
        console.error('Fetch builders error:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBuilders()
  }, [sortBy])

  if (isLoading) {
    return (
      <div className="ag-builders-container">
        <div className="ag-loading">Loading builders...</div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="ag-builders-container">
        <div className="ag-error">Failed to load builders. Please try again.</div>
      </div>
    )
  }

  return (
    <div className="ag-builders-container">
      <div className="ag-builders-header">
        <h1>Explore Builders</h1>
        <p>Discover what other builders are creating</p>

        <div className="ag-builders-sort">
          <button
            className={sortBy === 'followers' ? 'active' : ''}
            onClick={() => setSortBy('followers')}
          >
            Most Followers
          </button>
          <button
            className={sortBy === 'apps' ? 'active' : ''}
            onClick={() => setSortBy('apps')}
          >
            Most Apps
          </button>
        </div>
      </div>

      <div className="ag-builders-grid">
        {builders.map(builder => (
          <BuilderCard
            key={builder.id}
            {...builder}
            isFollowing={followingSet.has(builder.id)}
            currentUserId={currentUserId || undefined}
          />
        ))}
      </div>

      {builders.length === 0 && (
        <div className="ag-empty-state">
          <p>No builders found</p>
        </div>
      )}
    </div>
  )
}
