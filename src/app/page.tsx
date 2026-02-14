"use client"

import { useState, useEffect } from "react"
import { BookDeal, DashboardStats } from "@/lib/types"
import { DealCard } from "@/components/DealCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency, formatRelativeTime } from "@/lib/utils"
import { Search, RefreshCw, TrendingUp, DollarSign, BookOpen, Filter, BarChart3 } from "lucide-react"

export default function Dashboard() {
  const [deals, setDeals] = useState<BookDeal[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [onlyProfitable, setOnlyProfitable] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [dealsRes, statsRes] = await Promise.all([
        fetch('/api/deals?profitable=false'),
        fetch('/api/stats')
      ])
      const dealsData = await dealsRes.json()
      const statsData = await statsRes.json()
      setDeals(dealsData.data || [])
      setStats(statsData.data || null)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = searchQuery === "" || 
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.isbn.includes(searchQuery)
    const matchesProfit = !onlyProfitable || deal.isProfitable
    return matchesSearch && matchesProfit
  })

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            Moxy Bot
          </h1>
          <p className="text-sm text-muted-foreground">Book Arbitrage Dashboard</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Total</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1">{stats.totalDeals}</p>
            </CardContent>
          </Card>
          
          <Card className={stats.profitableDeals > 0 ? "border-green-200 bg-green-50" : ""}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-muted-foreground">Profitables</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-green-600">{stats.profitableDeals}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Profit Total</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-green-600">
                {formatCurrency(stats.totalPotentialProfit)}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-muted-foreground">Meilleur</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold mt-1 text-green-600">
                +{formatCurrency(stats.topProfit)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher par titre ou ISBN..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Switch 
                  checked={onlyProfitable} 
                  onCheckedChange={setOnlyProfitable}
                />
                <span className="hidden sm:inline">Profitable uniquement</span>
                <span className="sm:hidden">Profit.</span>
              </label>
              <Badge variant={onlyProfitable ? "success" : "secondary"}>
                {filteredDeals.filter(d => d.isProfitable).length} / {filteredDeals.length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deals List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Livres disponibles
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              Mis à jour {formatRelativeTime(lastUpdate.toISOString())}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)] sm:h-[500px]">
            <div className="p-4 pt-0 space-y-3">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-36 bg-gray-100 rounded-lg animate-pulse" />
                ))
              ) : filteredDeals.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucun livre trouvé</p>
                </div>
              ) : (
                filteredDeals.map(deal => (
                  <div key={deal.id} className="animate-fade-in">
                    <DealCard deal={deal} />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-muted-foreground">
        <p>Moxy Bot - Vinted Book Arbitrage • Scanne les nouvelles annonces</p>
        <p className="mt-1">Basé sur le code legacy de moxy.py</p>
      </div>
    </div>
  )
}
