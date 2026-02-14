import { NextResponse } from 'next/server'
import { getAllDeals, getProfitableDeals, searchDeals } from '@/lib/deals'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const profitable = searchParams.get('profitable')
  const limit = parseInt(searchParams.get('limit') || '20')

  let deals = query 
    ? await searchDeals(query) 
    : (profitable === 'true' ? await getProfitableDeals() : await getAllDeals())

  deals = deals.slice(0, limit)

  return NextResponse.json({
    success: true,
    data: deals,
    count: deals.length
  })
}
