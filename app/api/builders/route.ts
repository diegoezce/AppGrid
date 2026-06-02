import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sort = searchParams.get('sort') || 'followers'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Get all users from public.users (which should include all auth users via trigger)
    let query = supabase
      .from('users')
      .select('*')
      .range(offset, offset + limit - 1)

    if (sort === 'followers') {
      query = query.order('followers_count', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data: builders, error } = await query
    if (error) throw error

    if (!builders || builders.length === 0) {
      return NextResponse.json([])
    }

    // Add app count to each builder
    const enriched = await Promise.all(
      builders.map(async (builder) => {
        const { count } = await supabase
          .from('apps')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', builder.id)
        return { ...builder, apps_count: count ?? 0 }
      })
    )

    return NextResponse.json(enriched)
  } catch (error) {
    console.error('Get builders error:', error)
    return NextResponse.json({ error: 'Failed to fetch builders' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { user_id, display_name, username, bio, avatar_url } = await request.json()

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        display_name: display_name || null,
        username: username || null,
        bio: bio || null,
        avatar_url: avatar_url || null,
      })
      .eq('id', user_id)
      .select()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
      }
      throw error
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Update builder error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
