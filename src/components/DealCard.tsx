"use client"

import { BookDeal } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatRelativeTime, getProfitColor } from "@/lib/utils"
import { ExternalLink, MapPin, User, Star, Truck, BookOpen } from "lucide-react"

interface DealCardProps {
  deal: BookDeal
}

export function DealCard({ deal }: DealCardProps) {
  const profit = deal.profit || 0
  const isProfitable = profit > 0

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${isProfitable ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
      <div className="flex">
        {/* Book Image */}
        <div className="relative w-28 h-36 sm:w-32 sm:h-44 flex-shrink-0">
          <img 
            src={deal.photoUrl} 
            alt={deal.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
            }}
          />
          {isProfitable && (
            <div className="absolute top-1 right-1">
              <Badge variant="success" className="text-xs font-bold">
                +{formatCurrency(profit)}
              </Badge>
            </div>
          )}
        </div>

        {/* Deal Info */}
        <CardContent className="flex-1 p-3 sm:p-4 space-y-2">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight">{deal.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 hidden sm:block">{deal.description}</p>
          </div>

          {/* ISBN & Condition */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              <BookOpen className="w-3 h-3 mr-1" />
              {deal.isbn}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {deal.condition}
            </Badge>
          </div>

          {/* Seller Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {deal.seller.username}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              +{deal.seller.positiveFeedback}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {deal.seller.location}
            </span>
          </div>

          {/* Price Breakdown */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold">{formatCurrency(deal.price)}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Truck className="w-3 h-3" />
                +{formatCurrency(deal.shippingCost)}
              </span>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${getProfitColor(profit)}`}>
                {formatCurrency(deal.momoxPrice || 0)}
              </div>
              <div className="text-xs text-muted-foreground">Momox</div>
            </div>
          </div>

          {/* Action */}
          <a 
            href={deal.vintedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-2"
          >
            <Button size="sm" className="w-full" variant={isProfitable ? "success" : "outline"}>
              <ExternalLink className="w-3 h-3 mr-1" />
              Voir sur Vinted
            </Button>
          </a>
        </CardContent>
      </div>
    </Card>
  )
}
