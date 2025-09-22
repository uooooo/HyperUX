import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Zap, Target, StopCircle } from "lucide-react"

export function ScalpingInterface() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Quick Order */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Quick Order
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">$43,250.50</div>
            <div className="text-sm text-chart-1 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +1.2% (+$520.30)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground">Size</label>
              <Input placeholder="0.1" className="text-center" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Leverage</label>
              <Input placeholder="3x" className="text-center" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button className="bg-chart-1 hover:bg-chart-1/90 text-white" size="lg">
              <TrendingUp className="h-4 w-4 mr-1" />
              LONG
            </Button>
            <Button className="bg-destructive hover:bg-destructive/90" size="lg">
              <TrendingDown className="h-4 w-4 mr-1" />
              SHORT
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">Hotkeys: L (Long) | S (Short) | Esc (Cancel)</div>
        </CardContent>
      </Card>

      {/* Risk Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-chart-3" />
            Risk Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Take Profit (%)</label>
              <Input placeholder="0.5" defaultValue="0.5" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Stop Loss (%)</label>
              <Input placeholder="0.3" defaultValue="0.3" />
            </div>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Risk/Reward</div>
            <div className="text-lg font-bold text-chart-1">1:1.67</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Max Risk per Trade</span>
              <span className="font-medium">2%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Daily Loss Limit</span>
              <span className="font-medium">-5%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Positions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StopCircle className="h-5 w-5 text-primary" />
            Active Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">ETH/USD</span>
              <Badge className="bg-chart-1 text-white">LONG 3x</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Entry</div>
                <div className="font-medium">$2,450.00</div>
              </div>
              <div>
                <div className="text-muted-foreground">PnL</div>
                <div className="font-medium text-chart-1">+$125.50</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
              Close Position
            </Button>
          </div>

          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">BTC/USD</span>
              <Badge variant="destructive">SHORT 2x</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground">Entry</div>
                <div className="font-medium">$43,100.00</div>
              </div>
              <div>
                <div className="text-muted-foreground">PnL</div>
                <div className="font-medium text-destructive">-$85.20</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
              Close Position
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
