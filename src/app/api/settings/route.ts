import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (key) {
      // Получить конкретную настройку
      const setting = await prisma.appSettings.findUnique({
        where: { key }
      })

      if (!setting) {
        return NextResponse.json({ error: 'Setting not found' }, { status: 404 })
      }

      return NextResponse.json({ 
        key: setting.key, 
        value: setting.value,
        description: setting.description 
      })
    } else {
      // Получить все настройки
      const settings = await prisma.appSettings.findMany()
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = {
          value: setting.value,
          description: setting.description
        }
        return acc
      }, {} as Record<string, { value: string; description?: string | null }>)

      return NextResponse.json(settingsMap)
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { key, value, description } = await request.json()

    if (!key || !value) {
      return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
    }

    const setting = await prisma.appSettings.upsert({
      where: { key },
      update: { value, description },
      create: { key, value, description }
    })

    return NextResponse.json({ 
      key: setting.key, 
      value: setting.value,
      description: setting.description 
    })
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}