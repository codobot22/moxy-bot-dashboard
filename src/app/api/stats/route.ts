import { NextResponse } from 'next/server'
import { getAllDeals, calculateStats } from '@/lib/deals'

export async function GET() {
  const deals = getAllDeals()
  const stats = calculateStats(deals)

  return NextResponse.json({
    success: true,
    data: stats
  })
}
