import { createClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updateId = params.id

    // Create like
    const { data, error } = await supabase
      .from('update_likes')
      .insert({
        update_id: updateId,
        user_id: user.id
      })
      .select()

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already liked this update' },
          { status: 409 }
        )
      }
      throw error
    }

    // Increment likes_count
    await supabase
      .from('application_updates')
      .update({ likes_count: (await supabase.from('update_likes').select('*', { count: 'exact' }).eq('update_id', updateId)).count || 0 })
      .eq('id', updateId)

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Like error:', error)
    return NextResponse.json(
      { error: 'Failed to like update' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const updateId = params.id

    // Delete like
    const { error } = await supabase
      .from('update_likes')
      .delete()
      .eq('update_id', updateId)
      .eq('user_id', user.id)

    if (error) throw error

    // Decrement likes_count
    const likesCount = await supabase.from('update_likes').select('*', { count: 'exact' }).eq('update_id', updateId)

    await supabase
      .from('application_updates')
      .update({ likes_count: likesCount.count || 0 })
      .eq('id', updateId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unlike error:', error)
    return NextResponse.json(
      { error: 'Failed to unlike update' },
      { status: 500 }
    )
  }
}
