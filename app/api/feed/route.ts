import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    // Get IDs of builders this user follows
    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user_id)

    if (followsError) throw followsError

    // Include the user's own updates + followed builders' updates
    const authorIds = [...new Set([user_id, ...(follows || []).map(f => f.following_id)])]

    // Get updates from followed builders + own updates with app and author info
    const { data: updates, error: updatesError } = await supabase
      .from('application_updates')
      .select(`
        *,
        app:app_id (id, title, image_url),
        author:author_id (id, email, display_name, avatar_url, username)
      `)
      .in('author_id', authorIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (updatesError) throw updatesError

    // Filter out updates with missing app or author (can happen if deleted)
    const validUpdates = (updates || []).filter(u => u.app && u.author)

    // Check which updates the current user has liked
    const updateIds = validUpdates.map(u => u.id)
    let likedSet = new Set<string>()

    if (updateIds.length > 0) {
      const { data: likes } = await supabase
        .from('update_likes')
        .select('update_id')
        .eq('user_id', user_id)
        .in('update_id', updateIds)

      if (likes) {
        likedSet = new Set(likes.map(l => l.update_id))
      }
    }

    const enriched = validUpdates.map(update => ({
      ...update,
      liked_by_user: likedSet.has(update.id)
    }))

    return NextResponse.json(enriched)
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json({ error: 'Failed to fetch feed' }, { status: 500 })
  }
}
