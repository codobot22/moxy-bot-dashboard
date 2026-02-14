import { BookDeal } from './types'
import { calculateProfit } from './utils'

// Sample book deals - In production, this comes from Vinted scraping + Momox API
const SAMPLE_DEALS: BookDeal[] = [
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
  },
  {
    id: '6',
    title: '1984 - George Orwell',
    description: 'Science-fiction classique',
    price: 4.50,
    shippingCost: 2.99,
    isbn: '9782070360028',
    brand: 'Folio SF',
    condition: 'Très bon',
    photoUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    vintedUrl: 'https://www.vinted.be/livres/123461',
    seller: {
      username: 'orwellfan',
      positiveFeedback: 234,
      negativeFeedback: 4,
      location: 'Lille'
    },
    momoxPrice: 8.00,
    foundAt: new Date(Date.now() - 18000000).toISOString()
  }
]

// Calculate profit for all deals
export function enrichDealsWithProfit(deals: BookDeal[]): BookDeal[] {
  return deals.map(deal => {
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

export function getAllDeals(): BookDeal[] {
  return enrichDealsWithProfit(SAMPLE_DEALS)
}

export function getProfitableDeals(): BookDeal[] {
  return getAllDeals().filter(deal => deal.isProfitable)
}

export function searchDeals(query: string): BookDeal[] {
  const lowerQuery = query.toLowerCase()
  return getAllDeals().filter(deal => 
    deal.title.toLowerCase().includes(lowerQuery) ||
    deal.isbn.includes(query) ||
    deal.description.toLowerCase().includes(lowerQuery)
  )
}

export function calculateStats(deals: BookDeal[]) {
  const enrichedDeals = enrichDealsWithProfit(deals)
  const profitableDeals = enrichedDeals.filter(d => d.isProfitable)
  const profits = enrichedDeals.map(d => d.profit || 0)

  return {
    totalDeals: enrichedDeals.length,
    profitableDeals: profitableDeals.length,
    totalPotentialProfit: profitableDeals.reduce((sum, d) => sum + (d.profit || 0), 0),
    averageProfit: profits.length > 0 
      ? profits.reduce((a, b) => a + b, 0) / profits.length 
      : 0,
    topProfit: Math.max(...profits),
    lastUpdated: new Date().toISOString()
  }
}
