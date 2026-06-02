'use client'

import { useEffect, useState } from 'react'
import BuilderCard from '@/app/components/BuilderCard'
import Navigation from '@/app/components/Navigation'
import { supabase } from '@/lib/supabase'
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
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const userId = session?.user?.id || null
        setCurrentUserId(userId)

        const [buildersRes, followsRes] = await Promise.all([
          fetch(`/api/builders?sort=${sortBy}&limit=50`),
          userId ? fetch(`/api/follows?user_id=${userId}&type=following`) : Promise.resolve(null)
        ])

        if (!buildersRes.ok) throw new Error('Failed to fetch builders')
        setBuilders(await buildersRes.json())

        if (followsRes?.ok) {
          const follows = await followsRes.json()
          setFollowingSet(new Set(follows.map((f: any) => f.following_id)))
        }
      } catch (error) {
        console.error('Fetch builders error:', error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [sortBy])

  if (isLoading) {
    return (
      <>
        <Navigation />
        <div className="ag-builders-container">
          <div className="ag-loading">Loading builders...</div>
        </div>
      </>
    )
  }

  if (hasError) {
    return (
      <>
        <Navigation />
        <div className="ag-builders-container">
          <div className="ag-error">Failed to load builders. Please try again.</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navigation />
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

        {builders.length === 0 ? (
          <div className="ag-empty-state">
            <p>No builders found</p>
          </div>
        ) : (
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
        )}
      </div>
    </>
  )
}
