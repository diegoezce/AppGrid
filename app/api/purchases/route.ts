import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const appId = searchParams.get('app_id')
  const userId = searchParams.get('user_id')

  try {
    let query = supabase
      .from('purchases')
      .select('*, apps(title, user_id)')
      .order('created_at', { ascending: false })

    if (appId) query = query.eq('app_id', appId)
    if (userId) query = query.eq('apps.user_id', userId)

    const { data, error } = await query
    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching purchases:', error)
    return NextResponse.json({ error: 'Error fetching purchases' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { app_id, buyer_email } = await request.json()

    if (!app_id || !buyer_email) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('purchases')
      .insert([{ app_id, buyer_email }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating purchase:', error)
    return NextResponse.json({ error: 'Error creating purchase' }, { status: 500 })
  }
}
