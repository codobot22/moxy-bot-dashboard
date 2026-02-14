export const VINTED_BOOKS_URL = 'https://www.vinted.be/livres?order=newest_first&status[]=1&status[]=2'

export const MOMOX_API_CONFIG = {
  baseUrl: 'https://api.momox.fr/api/v4/offer',
  headers: {
    'X-API-TOKEN': process.env.MOMOX_API_KEY || '2231443b8fb511c7b6a0eb25a62577320bac69b6',
    'X-CLIENT-VERSION': 'r5299-76accf6',
    'X-MARKETPLACE-ID': 'momox_fr',
  },
}

export const DASHBOARD_CONFIG = {
  refreshIntervalMs: 30000,
  maxDealsToShow: 50,
  minProfitThreshold: 0,
}
