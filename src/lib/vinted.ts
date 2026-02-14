// Vinted API integration - based on legacy vinted.py logic

const VINTED_API_URL = 'https://www.vinted.fr/api/v2/items'

export interface VintedItem {
  id: number
  title: string
  description: string
  price: number
  currency: string
  photo_url: string
  url: string
  brand_title?: string
  size_title?: string
  status: string
  user: {
    login: string
    positive_feedback_count: number
    negative_feedback_count: number
    city?: string
    country?: string
  }
  shipping_price?: number
}

export interface VintedSearchResponse {
  items: VintedItem[]
  total: number
  page: number
  per_page: number
}

export async function searchVintedBooks(page: number = 1, perPage: number = 20): Promise<VintedSearchResponse> {
  const params = new URLSearchParams({
    catalog_ids: '79',
    page: page.toString(),
    per_page: perPage.toString(),
    order: 'newest_first',
    status: '1,2',
  })

  try {
    const response = await fetch(`${VINTED_API_URL}?${params.toString()}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Vinted API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Vinted API error:', error)
    return { items: [], total: 0, page, per_page: perPage }
  }
}

export async function getVintedItem(itemId: number): Promise<VintedItem | null> {
  try {
    const response = await fetch(`${VINTED_API_URL}/${itemId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.item || null
  } catch (error) {
    console.error('Vinted item fetch error:', error)
    return null
  }
}

export function extractISBN(description: string): string | null {
  const patterns = [
    /ISBN[:\s]*(\d{10,13})/i,
    /(\d{10,13})/,
    /ean[:\s]*(\d{10,13})/i,
  ]

  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match) {
      return match[1] || match[0]
    }
  }

  return null
}
