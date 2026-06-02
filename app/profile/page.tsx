'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import './profile.css'

interface UserProfile {
  id: string
  email: string
  display_name: string | null
  username: string | null
  bio: string | null
  avatar_url: string | null
  followers_count: number
  following_count: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    bio: '',
    avatar_url: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          router.push('/auth')
          return
        }

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          // Create user if not exists
          const { data: newUser } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email
            })
            .select()
            .single()

          if (newUser) {
            setProfile(newUser)
            setFormData({
              display_name: newUser.display_name || '',
              username: newUser.username || '',
              bio: newUser.bio || '',
              avatar_url: newUser.avatar_url || ''
            })
          }
        } else {
          setProfile(data)
          setFormData({
            display_name: data.display_name || '',
            username: data.username || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || ''
          })
        }
      } catch (error) {
        console.error('Fetch profile error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch('/api/builders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updated = await response.json()
      setProfile(updated)
      alert('Profile updated successfully!')
      router.refresh()
    } catch (error) {
      console.error('Update profile error:', error)
      alert('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="ag-profile-container">
        <div className="ag-loading">Loading profile...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="ag-profile-container">
        <div className="ag-error">Failed to load profile</div>
      </div>
    )
  }

  return (
    <div className="ag-profile-container">
      <div className="ag-profile-header">
        <h1>My Profile</h1>
        <Link href={profile.username ? `/builders/${profile.username}` : '#'} className="ag-view-profile-link">
          View Public Profile →
        </Link>
      </div>

      <div className="ag-profile-card">
        <form onSubmit={handleSubmit} className="ag-profile-form">
          <div className="ag-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              disabled
              className="ag-input-disabled"
            />
            <small>Email cannot be changed</small>
          </div>

          <div className="ag-form-group">
            <label htmlFor="display_name">Display Name</label>
            <input
              type="text"
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Your full name"
              className="ag-input"
            />
          </div>

          <div className="ag-form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="your_username"
              className="ag-input"
            />
            <small>URL-friendly username for your profile</small>
          </div>

          <div className="ag-form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell builders about yourself"
              rows={4}
              className="ag-textarea"
            />
          </div>

          <div className="ag-form-group">
            <label htmlFor="avatar_url">Avatar URL</label>
            <input
              type="url"
              id="avatar_url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="ag-input"
            />
            {formData.avatar_url && (
              <div className="ag-avatar-preview">
                <img src={formData.avatar_url} alt="Preview" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="ag-button-submit"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="ag-profile-stats">
        <h2>Your Stats</h2>
        <div className="ag-stats-grid">
          <div className="ag-stat-card">
            <div className="ag-stat-number">{profile.followers_count}</div>
            <div className="ag-stat-label">Followers</div>
          </div>
          <div className="ag-stat-card">
            <div className="ag-stat-number">{profile.following_count}</div>
            <div className="ag-stat-label">Following</div>
          </div>
        </div>
      </div>
    </div>
  )
}
