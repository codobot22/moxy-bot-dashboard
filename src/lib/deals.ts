import { BookDeal } from './types'
import { calculateProfit } from './utils'
import { getMomoxPrice } from './momox'

// Demo data as fallback
const DEMO_DEALS: BookDeal[] = [
  {
    id: '1',
    title: 'Harry Potter et l\'Enfant Maudit - J.K. Rowling',
    description: 'Livre en très bon état, jaquette légèrement usée',
    price: 8.50,
    shippingCost: 2.99,
    isbn: '9782070584628',
    brand: 'Folio',
    condition: 'Très bon',
    photoUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    vintedUrl: 'https://www.vinted.be/livres/123456',
    seller: {
      username: 'livreophile',
      positiveFeedback: 245,
      negativeFeedback: 3,
      location: 'Paris'
    },
    momoxPrice: 15.20,
    foundAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Le Petit Prince - Antoine de Saint-Exupéry',
    description: 'Édition collector, état neuf',
    price: 12.00,
    shippingCost: 3.50,
    isbn: '9782070612758',
    brand: 'Gallimard',
    condition: 'Neuf',
    photoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    vintedUrl: 'https://www.vinted.be/livres/123457',
    seller: {
      username: 'lecteurpassione',
      positiveFeedback: 89,
      negativeFeedback: 1,
      location: 'Lyon'
    },
    momoxPrice: 18.00,
    foundAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '3',
    title: 'Les Misérables - Victor Hugo',
    description: 'Complet, quelques traces de manipulation',
    price: 6.00,
    shippingCost: 2.99,
    isbn: '9782070408254',
    brand: 'Folio Classique',
    condition: 'Bon',
    photoUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    vintedUrl: 'https://www.vinted.be/livres/123458',
    seller: {
      username: 'bibliophile77',
      positiveFeedback: 156,
      negativeFeedback: 5,
      location: 'Marseille'
    },
    momoxPrice: 9.50,
    foundAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: '4',
    title: 'Da Vinci Code - Dan Brown',
    description: 'Roman Policier - État excellent',
    price: 5.00,
    shippingCost: 2.99,
    isbn: '9782709628436',
    brand: 'Le Livre de Poche',
    condition: 'Très bon',
    photoUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400',
    vintedUrl: 'https://www.vinted.be/livres/123459',
    seller: {
      username: 'lecturedudimanche',
      positiveFeedback: 42,
      negativeFeedback: 0,
      location: 'Bordeaux'
    },
    momoxPrice: 11.00,
    foundAt: new Date(Date.now() - 10800000).toISOString()
  },
  {
    id: '5',
    title: 'L\'Alchimiste - Paulo Coelho',
    description: 'Best-seller international',
    price: 7.50,
    shippingCost: 2.99,
    isbn: '9782757847544',
    brand: 'J\'ai Lu',
    condition: 'Bon',
    photoUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    vintedUrl: 'https://www.vinted.be/livres/123460',
    seller: {
      username: 'spiritualreader',
      positiveFeedback: 78,
      negativeFeedback: 2,
      location: 'Strasbourg'
    },
    momoxPrice: 12.00,
    foundAt: new Date(Date.now() - 14400000).toISOString()
  }
]

// Enrich demo deals with profit calculation
function enrichDemoDeals(): BookDeal[] {
  return DEMO_DEALS.map(deal => {
    const { profit, totalCost, protectionFee, isProfitable } = calculateProfit(
      deal.price,
      deal.shippingCost,
      deal.momoxPrice || 0
    )
    return {
      ...deal,
      protectionFee,
      totalCost,
      profit,
      isProfitable
    }
  })
}

// Vinted API integration (when available)
async function fetchFromVintedAPI(): Promise<BookDeal[]> {
  try {
    // Vinted GraphQL API endpoint
    const response = await fetch('https://www.vinted.fr/api/v2/items?catalog_ids=79&status=1,2&order=newest_first&per_page=20', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)',
        'Accept': 'application/json',
      },
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      throw new Error(`Vinted API error: ${response.status}`)
    }

    const data = await response.json()
    const deals: BookDeal[] = []

    for (const item of data.items || []) {
      const isbn = extractISBN(item.description || '')
      const momoxPrice = isbn ? await getMomoxPrice(isbn) : 0
      const shippingCost = item.shipping_price || 2.99
      const { profit, totalCost, protectionFee, isProfitable } = calculateProfit(
        item.price,
        shippingCost,
        momoxPrice
      )

      deals.push({
        id: item.id.toString(),
        title: item.title,
        description: item.description || '',
        price: item.price,
        shippingCost,
        isbn,
        brand: item.brand_title,
        condition: item.status === '1' ? 'Neuf' : 'Très bon',
        photoUrl: item.photo_url,
        vintedUrl: item.url,
        seller: {
          username: item.user.login,
          positiveFeedback: item.user.positive_feedback_count,
          negativeFeedback: item.user.negative_feedback_count,
          location: item.user.city || item.user.country || 'France'
        },
        momoxPrice,
        protectionFee,
        totalCost,
        profit,
        isProfitable,
        foundAt: new Date().toISOString()
      })
    }

    return deals
  } catch (error) {
    console.error('Vinted API fetch failed:', error)
    return []
  }
}

function extractISBN(description: string): string {
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
  return ''
}

export async function getAllDeals(): Promise<BookDeal[]> {
  // Try Vinted API first
  const vintedDeals = await fetchFromVintedAPI()
  
  // If Vinted API returns data, use it
  if (vintedDeals.length > 0) {
    return vintedDeals
  }

  // Fall back to demo data
  return enrichDemoDeals()
}

export function getProfitableDeals(): Promise<BookDeal[]> {
  return getAllDeals().then(deals => deals.filter(d => d.isProfitable))
}

export async function searchDeals(query: string): Promise<BookDeal[]> {
  const deals = await getAllDeals()
  const lowerQuery = query.toLowerCase()
  return deals.filter(deal => 
    deal.title.toLowerCase().includes(lowerQuery) ||
    deal.isbn.includes(query) ||
    deal.description.toLowerCase().includes(lowerQuery)
  )
}

export function calculateStats(deals: BookDeal[]) {
  const profitableDeals = deals.filter(d => d.isProfitable)
  const profits = deals.map(d => d.profit || 0)

  return {
    totalDeals: deals.length,
    profitableDeals: profitableDeals.length,
    totalPotentialProfit: profitableDeals.reduce((sum, d) => sum + (d.profit || 0), 0),
    averageProfit: profits.length > 0 
      ? profits.reduce((a, b) => a + b, 0) / profits.length 
      : 0,
    topProfit: Math.max(...profits),
    lastUpdated: new Date().toISOString()
  }
}
