import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('apps')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching apps:', error)
    return NextResponse.json({ error: 'Error fetching apps' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.title || !body.description || !body.app_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('apps')
      .insert([
        {
          title: body.title,
          description: body.description,
          category: body.category || 'general',
          image_url: body.image_url,
          app_url: body.app_url,
          price: body.price || '0',
        },
      ])
      .select()

    if (error) throw error
    return NextResponse.json(data?.[0], { status: 201 })
  } catch (error) {
    console.error('Error creating app:', error)
    return NextResponse.json({ error: 'Error creating app' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'Missing app id' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('apps')
      .update({
        title: body.title,
        description: body.description,
        category: body.category,
        image_url: body.image_url,
        app_url: body.app_url,
        price: body.price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()

    if (error) throw error
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'App not found' }, { status: 404 })
    }
    return NextResponse.json(data[0])
  } catch (error) {
    console.error('Error updating app:', error)
    return NextResponse.json({ error: 'Error updating app' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing app id' }, { status: 400 })
    }

    const { error } = await supabase
      .from('apps')
      .delete()
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting app:', error)
    return NextResponse.json({ error: 'Error deleting app' }, { status: 500 })
  }
}
