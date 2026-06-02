import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: builder, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', params.username)
      .single()

    if (error || !builder) {
      return NextResponse.json(
        { error: 'Builder not found' },
        { status: 404 }
      )
    }

    // Get app count
    const { count: appsCount } = await supabase
      .from('apps')
      .select('*', { count: 'exact' })
      .eq('user_id', builder.id)

    // Check if current user follows this builder
    let isFollowing = false
    if (user) {
      const { data: follows } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', builder.id)
        .single()

      isFollowing = !!follows
    }

    return NextResponse.json({
      ...builder,
      apps_count: appsCount || 0,
      is_following: isFollowing,
      is_own_profile: user?.id === builder.id
    })
  } catch (error) {
    console.error('Get builder error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch builder' },
      { status: 500 }
    )
  }
}
