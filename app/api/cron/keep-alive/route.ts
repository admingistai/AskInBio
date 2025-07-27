import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple query to keep database active
    await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database keep-alive successful',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Database keep-alive failed' },
      { status: 500 }
    )
  }
}

// Allow Vercel Cron to access this endpoint
export const runtime = 'edge'