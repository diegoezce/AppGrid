import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { containsBannedWords, RATE_LIMIT } from '@/lib/moderation'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: updateId } = await params

    const { data, error } = await supabase
      .from('update_comments')
      .select(`
        id,
        content,
        created_at,
        user:users(id, display_name, username, avatar_url)
      `)
      .eq('update_id', updateId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: updateId } = await params
    const { user_id, content } = await request.json()

    if (!user_id || !content?.trim()) {
      return NextResponse.json({ error: 'user_id and content are required' }, { status: 400 })
    }

    if (content.length > 500) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
    }

    if (containsBannedWords(content)) {
      return NextResponse.json({ error: 'Your comment contains inappropriate content' }, { status: 422 })
    }

    const windowStart = new Date(Date.now() - RATE_LIMIT.WINDOW_MINUTES * 60 * 1000).toISOString()
    const { count } = await supabase
      .from('update_comments')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .gte('created_at', windowStart)

    if ((count ?? 0) >= RATE_LIMIT.MAX_COMMENTS) {
      return NextResponse.json(
        { error: `Too many comments. Max ${RATE_LIMIT.MAX_COMMENTS} per hour.` },
        { status: 429 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('update_comments')
      .insert({ update_id: updateId, user_id, content: content.trim() })
      .select(`
        id,
        content,
        created_at,
        user:users(id, display_name, username, avatar_url)
      `)
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Post comment error:', error)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  _context: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const comment_id = searchParams.get('comment_id')
    const user_id = searchParams.get('user_id')

    if (!comment_id || !user_id) {
      return NextResponse.json({ error: 'comment_id and user_id are required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('update_comments')
      .delete()
      .eq('id', comment_id)
      .eq('user_id', user_id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 })
  }
}
