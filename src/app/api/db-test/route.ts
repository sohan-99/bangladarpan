import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection with a simple query
    await prisma.$connect()
    console.log('✅ Prisma connected successfully')
    
    // Execute a simple query to test the connection
    const result = await prisma.$queryRawUnsafe('SELECT DATABASE() as dbName, VERSION() as version')
    console.log('✅ Query executed:', result)
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully!',
      data: result,
    })
  } catch (error) {
    console.error('❌ Database connection error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
