import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params
    const { searchParams } = new URL(request.url)
    const current_user_id = searchParams.get('current_user_id')

    const { data: builder, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !builder) {
      return NextResponse.json({ error: 'Builder not found' }, { status: 404 })
    }

    const { count: appsCount } = await supabase
      .from('apps')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', builder.id)

    let isFollowing = false
    if (current_user_id) {
      const { data: follow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', current_user_id)
        .eq('following_id', builder.id)
        .maybeSingle()

      isFollowing = !!follow
    }

    return NextResponse.json({
      ...builder,
      apps_count: appsCount ?? 0,
      is_following: isFollowing,
      is_own_profile: current_user_id === builder.id,
    })
  } catch (error) {
    console.error('Get builder error:', error)
    return NextResponse.json({ error: 'Failed to fetch builder' }, { status: 500 })
  }
}
