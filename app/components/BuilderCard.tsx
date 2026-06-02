'use client'

import Link from 'next/link'
import FollowButton from './FollowButton'

interface BuilderCardProps {
  id: string
  display_name: string
  username: string
  bio: string | null
  avatar_url: string | null
  followers_count: number
  apps_count?: number
  isFollowing?: boolean
  isOwnProfile?: boolean
  currentUserId?: string
}

export default function BuilderCard({
  id,
  display_name,
  username,
  bio,
  avatar_url,
  followers_count,
  apps_count = 0,
  isFollowing = false,
  isOwnProfile = false,
  currentUserId
}: BuilderCardProps) {
  if (!username) return null

  return (
    <div className="ag-builder-card">
      <Link href={`/builders/${username}`} className="ag-builder-card-header">
        {avatar_url && (
          <img
            src={avatar_url}
            alt={display_name}
            className="ag-builder-avatar-lg"
          />
        )}
        <div className="ag-builder-info">
          <h3 className="ag-builder-name">{display_name || username}</h3>
          <p className="ag-builder-username">@{username}</p>
        </div>
      </Link>

      {bio && <p className="ag-builder-bio">{bio}</p>}

      <div className="ag-builder-stats">
        <div className="ag-stat">
          <span className="ag-stat-value">{apps_count}</span>
          <span className="ag-stat-label">apps</span>
        </div>
        <div className="ag-stat">
          <span className="ag-stat-value">{followers_count}</span>
          <span className="ag-stat-label">followers</span>
        </div>
      </div>

      {currentUserId && currentUserId !== id && (
        <FollowButton userId={id} currentUserId={currentUserId} isFollowing={isFollowing} />
      )}
    </div>
  )
}
