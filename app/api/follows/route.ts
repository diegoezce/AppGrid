import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { following_id } = await request.json()

    if (!following_id) {
      return NextResponse.json(
        { error: 'following_id is required' },
        { status: 400 }
      )
    }

    if (following_id === user.id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    // Create follow relationship
    const { data, error } = await supabase
      .from('follows')
      .insert({
        follower_id: user.id,
        following_id: following_id
      })
      .select()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already following this user' },
          { status: 409 }
        )
      }
      throw error
    }

    // Update counters
    await supabase
      .from('users')
      .update({ following_count: (await supabase.from('follows').select('*', { count: 'exact' }).eq('follower_id', user.id)).count || 0 })
      .eq('id', user.id)

    await supabase
      .from('users')
      .update({ followers_count: (await supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', following_id)).count || 0 })
      .eq('id', following_id)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
    const following_id = searchParams.get('following_id')

    if (!following_id) {
      return NextResponse.json(
        { error: 'following_id is required' },
        { status: 400 }
      )
    }

    // Delete follow relationship
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', user.id)
      .eq('following_id', following_id)

    if (error) throw error

    // Update counters
    const following_count = await supabase.from('follows').select('*', { count: 'exact' }).eq('follower_id', user.id)
    const followers_count = await supabase.from('follows').select('*', { count: 'exact' }).eq('following_id', following_id)

    await supabase
      .from('users')
      .update({ following_count: following_count.count || 0 })
      .eq('id', user.id)

    await supabase
      .from('users')
      .update({ followers_count: followers_count.count || 0 })
      .eq('id', following_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unfollow error:', error)
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const type = searchParams.get('type') // 'followers' or 'following'

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    let query = supabase.from('follows').select('*')

    if (type === 'followers') {
      query = query.eq('following_id', user_id)
    } else if (type === 'following') {
      query = query.eq('follower_id', user_id)
    } else {
      return NextResponse.json(
        { error: 'type must be "followers" or "following"' },
        { status: 400 }
      )
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get follows error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch follows' },
      { status: 500 }
    )
  }
}
