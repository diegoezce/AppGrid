import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get users that current user follows
    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id)

    if (followsError) throw followsError

    const followedIds = follows.map(f => f.following_id)

    // If user doesn't follow anyone, return empty feed
    if (followedIds.length === 0) {
      return NextResponse.json([])
    }

    // Get updates from followed builders, with app and author info
    const { data: updates, error: updatesError } = await supabase
      .from('application_updates')
      .select(`
        *,
        app:app_id (id, title, image_url),
        author:author_id (id, email, display_name, avatar_url, username)
      `)
      .in('author_id', followedIds)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (updatesError) throw updatesError

    // Check if current user liked each update
    const updateIds = updates.map(u => u.id)
    let userLikes = new Map()

    if (updateIds.length > 0) {
      const { data: likes, error: likesError } = await supabase
        .from('update_likes')
        .select('update_id')
        .eq('user_id', user.id)
        .in('update_id', updateIds)

      if (likesError) throw likesError

      userLikes = new Map(likes.map(l => [l.update_id, true]))
    }

    // Add liked flag to each update
    const enrichedUpdates = updates.map(update => ({
      ...update,
      liked_by_user: userLikes.has(update.id)
    }))

    return NextResponse.json(enrichedUpdates)
  } catch (error) {
    console.error('Feed error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    )
  }
}
