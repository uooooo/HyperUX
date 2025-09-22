import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, DollarSign, Calendar, Bell } from "lucide-react"

export function DCAInterface() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* DCA Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-chart-1" />
            DCA Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asset">Asset</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">BTC/USD</SelectItem>
                  <SelectItem value="eth">ETH/USD</SelectItem>
                  <SelectItem value="sol">SOL/USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Amount ($)</Label>
              <Input id="amount" placeholder="100" type="number" />
            </div>
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-execute">Auto Execute</Label>
            <Switch id="auto-execute" />
          </div>

          <Button className="w-full" size="lg">
            Start DCA Strategy
          </Button>
        </CardContent>
      </Card>

      {/* Safety & Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Safety & Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Funding Rate Alert</span>
            </div>
            <p className="text-sm text-muted-foreground">Alert when funding rate exceeds 0.1%</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">Current: 0.05%</span>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Price Drop Alert (-10%)</span>
              <Switch />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Weekly Summary</span>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Execution Confirmation</span>
              <Switch defaultChecked />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Next Execution</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Tomorrow, 9:00 AM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
