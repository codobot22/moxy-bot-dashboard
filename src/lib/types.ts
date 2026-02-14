// Book Deal Types - Based on legacy moxy.py arbitrage logic

export interface BookDeal {
  id: string;
  title: string;
  description: string;
  price: number;
  shippingCost: number;
  isbn: string;
  brand?: string;
  size?: string;
  condition: string;
  photoUrl: string;
  vintedUrl: string;
  seller: {
    username: string;
    positiveFeedback: number;
    negativeFeedback: number;
    location: string;
  };
  momoxPrice?: number;
  protectionFee?: number;
  totalCost?: number;
  profit?: number;
  isProfitable?: boolean;
  foundAt: string;
}

export interface DealFilters {
  query: string;
  minProfit: number;
  maxPrice: number;
  onlyProfitable: boolean;
  sortBy: 'profit' | 'date' | 'price';
  sortOrder: 'asc' | 'desc';
}

export interface DashboardStats {
  totalDeals: number;
  profitableDeals: number;
  totalPotentialProfit: number;
  averageProfit: number;
  topProfit: number;
  lastUpdated: string;
}
