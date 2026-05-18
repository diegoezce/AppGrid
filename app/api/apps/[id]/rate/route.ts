import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { rating } = await request.json()

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const { data: app, error: fetchError } = await supabase
      .from('apps')
      .select('rating, rating_count')
      .eq('id', id)
      .single()

    if (fetchError || !app) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }

    const newCount = (app.rating_count || 0) + 1
    const newRating = ((app.rating || 0) * (app.rating_count || 0) + rating) / newCount

    const { data, error } = await supabase
      .from('apps')
      .update({ rating: Math.round(newRating * 100) / 100, rating_count: newCount })
      .eq('id', id)
      .select('rating, rating_count')
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error rating app:', error)
    return NextResponse.json({ error: 'Error rating app' }, { status: 500 })
  }
}
