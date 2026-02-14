import { NextResponse } from 'next/server'
import { MOMOX_API_CONFIG } from '@/lib/constants'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const isbn = searchParams.get('isbn')

  if (!isbn) {
    return NextResponse.json({ success: false, error: 'ISBN required' }, { status: 400 })
  }

  try {
    const response = await fetch(`${MOMOX_API_CONFIG.baseUrl}?ean=${isbn}`, {
      headers: MOMOX_API_CONFIG.headers
    })
    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        ean: isbn,
        price: data.price || null
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch price' }, { status: 500 })
  }
}
