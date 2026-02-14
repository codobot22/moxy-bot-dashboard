// Momox API integration - based on legacy moxy.py logic

const MOMOX_API_URL = 'https://api.momox.fr/api/v4/offer'

export interface MomoxOfferResponse {
  ean: string
  price: number | null
  condition: 'NEUF' | 'TRES_BON' | 'BON' | 'ACCEPTABLE' | null
  isAccepted: boolean
}

export async function getMomoxPrice(ean: string): Promise<number> {
  if (!ean || ean.length < 10) {
    return 0
  }

  try {
    const response = await fetch(`${MOMOX_API_URL}?ean=${ean}`, {
      headers: {
        'X-API-TOKEN': process.env.MOMOX_API_KEY || '2231443b8fb511c7b6a0eb25a62577320bac69b6',
        'X-CLIENT-VERSION': 'r5299-76accf6',
        'X-MARKETPLACE-ID': 'momox_fr',
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      console.error(`Momox API error: ${response.status}`)
      return 0
    }

    const data = await response.json()
    return data.price || 0
  } catch (error) {
    console.error('Momox API error:', error)
    return 0
  }
}

export async function getMomoxOffer(ean: string): Promise<MomoxOfferResponse> {
  if (!ean || ean.length < 10) {
    return { ean, price: null, condition: null, isAccepted: false }
  }

  try {
    const response = await fetch(`${MOMOX_API_URL}?ean=${ean}`, {
      headers: {
        'X-API-TOKEN': process.env.MOMOX_API_KEY || '2231443b8fb511c7b6a0eb25a62577320bac69b6',
        'X-CLIENT-VERSION': 'r5299-76accf6',
        'X-MARKETPLACE-ID': 'momox_fr',
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      return { ean, price: null, condition: null, isAccepted: false }
    }

    const data = await response.json()
    return {
      ean,
      price: data.price || null,
      condition: data.condition || null,
      isAccepted: data.price > 0
    }
  } catch (error) {
    console.error('Momox API error:', error)
    return { ean, price: null, condition: null, isAccepted: false }
  }
}
