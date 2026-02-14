import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins}min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR')
}

export function calculateProfit(
  vintedPrice: number,
  shippingCost: number,
  momoxPrice: number
) {
  const protectionFee = (vintedPrice * 0.05) + 0.70
  const totalCost = vintedPrice + protectionFee + shippingCost
  const profit = momoxPrice - totalCost

  return {
    protectionFee: Math.round(protectionFee * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    profit: Math.round(profit * 100) / 100,
    isProfitable: profit > 0
  }
}

export function getProfitColor(profit: number): string {
  if (profit > 10) return 'text-green-500'
  if (profit > 5) return 'text-green-400'
  if (profit > 0) return 'text-green-300'
  if (profit > -5) return 'text-red-400'
  return 'text-red-500'
}

export function getProfitBadgeVariant(profit: number): 'success' | 'warning' | 'destructive' {
  if (profit > 5) return 'success'
  if (profit > 0) return 'warning'
  return 'destructive'
}
