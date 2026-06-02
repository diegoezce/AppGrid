import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: updateId } = await params
    const { user_id } = await request.json()

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('update_likes')
      .insert({ update_id: updateId, user_id })
      .select()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Already liked this update' }, { status: 409 })
      }
      throw error
    }

    const { count } = await supabase
      .from('update_likes').select('*', { count: 'exact', head: true }).eq('update_id', updateId)

    await supabaseAdmin
      .from('application_updates')
      .update({ likes_count: count ?? 0 })
      .eq('id', updateId)

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json({ error: 'Failed to like update' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: updateId } = await params
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('update_likes')
      .delete()
      .eq('update_id', updateId)
      .eq('user_id', user_id)

    if (error) throw error

    const { count } = await supabase
      .from('update_likes').select('*', { count: 'exact', head: true }).eq('update_id', updateId)

    await supabaseAdmin
      .from('application_updates')
      .update({ likes_count: count ?? 0 })
      .eq('id', updateId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json({ error: 'Failed to unlike update' }, { status: 500 })
  }
}
