import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort') || 'followers' // 'followers' or 'apps'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('users')
      .select('*')
      .range(offset, offset + limit - 1)

    if (sort === 'followers') {
      query = query.order('followers_count', { ascending: false })
    } else if (sort === 'apps') {
      query = query.order('created_at', { ascending: false })
    }

    const { data: builders, error } = await query

    if (error) throw error

    // Get app counts for each builder
    const buildersWithAppCounts = await Promise.all(
      builders.map(async (builder) => {
        const { count } = await supabase
          .from('apps')
          .select('*', { count: 'exact' })
          .eq('user_id', builder.id)

        return {
          ...builder,
          apps_count: count || 0
        }
      })
    )

    return NextResponse.json(buildersWithAppCounts)
  } catch (error) {
    console.error('Get builders error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch builders' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { display_name, username, bio, avatar_url } = await request.json()

    // Update user profile
    const { data, error } = await supabase
      .from('users')
      .update({
        display_name: display_name || null,
        username: username || null,
        bio: bio || null,
        avatar_url: avatar_url || null
      })
      .eq('id', user.id)
      .select()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 409 }
        )
      }
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Update builder error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
