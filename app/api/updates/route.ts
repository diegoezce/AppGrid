import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const app_id = searchParams.get('app_id')
    const user_id = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('application_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (app_id) query = query.eq('app_id', app_id)
    if (user_id) query = query.eq('author_id', user_id)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Get updates error:', error)
    return NextResponse.json({ error: 'Failed to fetch updates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { app_id, author_id, title, content } = await request.json()

    if (!app_id || !author_id || !title || !content) {
      return NextResponse.json(
        { error: 'app_id, author_id, title, and content are required' },
        { status: 400 }
      )
    }

    // Verify user owns the app
    const { data: app } = await supabase
      .from('apps')
      .select('user_id')
      .eq('id', app_id)
      .single()

    if (!app || app.user_id !== author_id) {
      return NextResponse.json({ error: 'You do not own this app' }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from('application_updates')
      .insert({ app_id, author_id, title, content, likes_count: 0 })
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Create update error:', error)
    return NextResponse.json({ error: 'Failed to create update' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, author_id, title, content } = await request.json()

    if (!id || !author_id || !title || !content) {
      return NextResponse.json(
        { error: 'id, author_id, title, and content are required' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabase
      .from('application_updates')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!existing || existing.author_id !== author_id) {
      return NextResponse.json({ error: 'You do not own this update' }, { status: 403 })
    }

    const { data, error } = await supabaseAdmin
      .from('application_updates')
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()

    if (error) throw error

    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const author_id = searchParams.get('author_id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    if (author_id) {
      const { data: existing } = await supabase
        .from('application_updates')
        .select('author_id')
        .eq('id', id)
        .single()

      if (!existing || existing.author_id !== author_id) {
        return NextResponse.json({ error: 'You do not own this update' }, { status: 403 })
      }
    }

    const { error } = await supabaseAdmin
      .from('application_updates')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete update error:', error)
    return NextResponse.json({ error: 'Failed to delete update' }, { status: 500 })
  }
}
