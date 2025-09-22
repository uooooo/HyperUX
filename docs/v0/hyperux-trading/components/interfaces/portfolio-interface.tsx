"use client"

import { Button } from "@/components/ui/button"
import { PieChart } from "lucide-react"

export function PortfolioInterface() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PieChart className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Portfolio Manager</h2>
        <div className="ml-auto text-xs text-muted-foreground">
          Prompt: "Multi-million position management with risk controls"
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="metric-value">$12.4M</div>
            <div className="metric-label">Total AUM</div>
          </div>
          <div className="text-right">
            <div className="text-success font-mono">+$78,320</div>
            <div className="metric-label">Today's P/L</div>
          </div>
        </div>

        <div>
          <div className="metric-label mb-2">Asset Allocation</div>
          <div className="flex h-3 rounded-full overflow-hidden">
            <div className="bg-chart-1 flex-1" />
            <div className="bg-chart-2 flex-1" />
            <div className="bg-chart-3 flex-1" />
            <div className="bg-chart-4 flex-1" />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>BTC</span>
            <span>ETH</span>
            <span>SOL</span>
            <span>Other</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-secondary rounded">
            <div className="metric-label">Risk Exposure</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Moderate</span>
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>
          <div className="p-3 bg-secondary rounded">
            <div className="metric-label">Margin Health</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Excellent</span>
              <div className="w-2 h-2 bg-success rounded-full" />
            </div>
          </div>
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          View Detailed Risk Analysis
        </Button>
      </div>
    </div>
  )
}
