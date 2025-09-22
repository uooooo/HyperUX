import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, ArrowRightLeft, AlertCircle } from "lucide-react"

export function ArbitrageInterface() {
  const opportunities = [
    {
      pair: "BTC/USDC vs BTC/USDT",
      spread: "0.15%",
      profit: "$45.20",
      exchanges: ["Hyperliquid", "Binance"],
      status: "active",
    },
    {
      pair: "ETH/USDC vs ETH/USDT",
      spread: "0.08%",
      profit: "$22.10",
      exchanges: ["Hyperliquid", "Coinbase"],
      status: "low",
    },
    {
      pair: "SOL/USDC vs SOL/USDT",
      spread: "0.22%",
      profit: "$67.80",
      exchanges: ["Hyperliquid", "Kraken"],
      status: "high",
    },
  ]

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Price Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-chart-3" />
            Price Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
              <div>Exchange</div>
              <div>BTC/USDC</div>
              <div>BTC/USDT</div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">Hyperliquid</div>
                <div className="text-lg font-bold">$43,250.50</div>
                <div className="text-lg font-bold">$43,185.30</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">Binance</div>
                <div className="text-lg">$43,245.20</div>
                <div className="text-lg">$43,180.10</div>
              </div>
              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="font-medium">Coinbase</div>
                <div className="text-lg">$43,255.80</div>
                <div className="text-lg">$43,190.50</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Best Spread</span>
                <div className="text-right">
                  <div className="font-bold text-chart-1">0.15%</div>
                  <div className="text-xs text-muted-foreground">HL vs Binance</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arbitrage Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {opportunities.map((opp, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-sm">{opp.pair}</div>
                    <div className="text-xs text-muted-foreground">{opp.exchanges.join(" ↔ ")}</div>
                  </div>
                  <Badge
                    variant={opp.status === "high" ? "default" : opp.status === "active" ? "secondary" : "outline"}
                    className={opp.status === "high" ? "bg-chart-1 text-white" : ""}
                  >
                    {opp.status === "high" ? "HIGH" : opp.status === "active" ? "ACTIVE" : "LOW"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Spread</div>
                    <div className="font-bold text-chart-1">{opp.spread}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Est. Profit</div>
                    <div className="font-bold">{opp.profit}</div>
                  </div>
                </div>

                <Button size="sm" className="w-full" variant={opp.status === "high" ? "default" : "outline"}>
                  Execute Arbitrage
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Auto-Execute Settings</span>
            </div>
            <div className="text-xs text-muted-foreground">Minimum spread: 0.1% | Max position: $1,000</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
