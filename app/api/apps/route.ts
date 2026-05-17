import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const APPS_FILE = join(process.cwd(), 'apps.json')

interface App {
  id: string
  title: string
  description: string
  category: string
  image_url?: string
  app_url: string
  price: string
  created_at: string
}

async function getApps(): Promise<App[]> {
  try {
    const data = await readFile(APPS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveApps(apps: App[]): Promise<void> {
  await writeFile(APPS_FILE, JSON.stringify(apps, null, 2))
}

export async function GET() {
  try {
    const apps = await getApps()
    return NextResponse.json(apps)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching apps' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validación
    if (!body.title || !body.description || !body.app_url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const apps = await getApps()

    const newApp: App = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      category: body.category || 'general',
      image_url: body.image_url,
      app_url: body.app_url,
      price: body.price || '0',
      created_at: new Date().toISOString(),
    }

    apps.push(newApp)
    await saveApps(apps)

    return NextResponse.json(newApp, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Error creating app' }, { status: 500 })
  }
}
