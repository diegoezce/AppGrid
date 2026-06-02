import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { follower_id, following_id } = await request.json()

    if (!follower_id || !following_id) {
      return NextResponse.json(
        { error: 'follower_id and following_id are required' },
        { status: 400 }
      )
    }

    if (follower_id === following_id) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('follows')
      .insert({ follower_id, following_id })
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

    // Sync counters
    const { count: followingCount } = await supabase
      .from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', follower_id)
    const { count: followersCount } = await supabase
      .from('follows').select('*', { count: 'exact', head: true }).eq('following_id', following_id)

    await supabaseAdmin.from('users').update({ following_count: followingCount ?? 0 }).eq('id', follower_id)
    await supabaseAdmin.from('users').update({ followers_count: followersCount ?? 0 }).eq('id', following_id)

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Follow error:', error)
    return NextResponse.json({ error: 'Failed to follow user' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const follower_id = searchParams.get('follower_id')
    const following_id = searchParams.get('following_id')

    if (!follower_id || !following_id) {
      return NextResponse.json(
        { error: 'follower_id and following_id are required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('follows')
      .delete()
      .eq('follower_id', follower_id)
      .eq('following_id', following_id)

    if (error) throw error

    const { count: followingCount } = await supabase
      .from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', follower_id)
    const { count: followersCount } = await supabase
      .from('follows').select('*', { count: 'exact', head: true }).eq('following_id', following_id)

    await supabaseAdmin.from('users').update({ following_count: followingCount ?? 0 }).eq('id', follower_id)
    await supabaseAdmin.from('users').update({ followers_count: followersCount ?? 0 }).eq('id', following_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unfollow error:', error)
    return NextResponse.json({ error: 'Failed to unfollow user' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    const type = searchParams.get('type')

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
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
    return NextResponse.json({ error: 'Failed to fetch follows' }, { status: 500 })
  }
}
