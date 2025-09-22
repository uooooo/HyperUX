"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeftRight } from "lucide-react"

export function ArbitrageInterface() {
  return (
    <div className="space-y-6 border border-teal-500/20 bg-teal-500/5 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-semibold text-teal-100">Arbitrage Monitor</h2>
        <div className="ml-auto text-xs text-teal-300/60">Prompt: "CEX-DEX arbitrage monitoring"</div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-teal-200/80 text-sm">Active Opportunities</span>
          <div className="bg-green-600 px-2 py-1 rounded text-xs text-white">LIVE</div>
        </div>

        <div className="space-y-3">
          <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-teal-100">SUSHI</div>
              <div className="text-green-400 font-mono text-lg">+1.8%</div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-teal-200/60">Binance</div>
                <div className="font-mono text-teal-100">$1.42</div>
              </div>
              <div>
                <div className="text-teal-200/60">Hyperliquid</div>
                <div className="font-mono text-teal-100">$1.45</div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-teal-500/20">
              <div className="text-xs text-teal-200/60">Est. Profit: $127</div>
              <div className="text-xs text-teal-200/60">Exec: ~2.3s</div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">Execute Arbitrage</Button>

        <div>
          <div className="text-teal-200/80 text-sm mb-2">Past 24h</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-teal-200/80">
              <span>LINK</span>
              <span className="text-green-400 font-mono">+0.7%</span>
              <span className="text-xs">15:23</span>
            </div>
            <div className="flex justify-between text-teal-200/80">
              <span>AAVE</span>
              <span className="text-green-400 font-mono">+0.5%</span>
              <span className="text-xs">12:07</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
