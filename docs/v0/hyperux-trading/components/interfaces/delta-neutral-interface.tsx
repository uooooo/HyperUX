"use client"

import { Button } from "@/components/ui/button"
import { Shield, RotateCcw } from "lucide-react"

export function DeltaNeutralInterface() {
  return (
    <div className="space-y-6 border border-teal-500/20 bg-teal-500/5 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <Shield className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-semibold text-teal-100">Delta Neutral</h2>
        <div className="ml-auto text-xs text-teal-300/60">Prompt: "Market neutral hedging strategy"</div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
            <div className="text-teal-200/60 text-xs">Spot Position</div>
            <div className="font-mono text-teal-100 text-lg">+10 ETH</div>
            <div className="text-teal-300/80 text-sm">$18,452.60</div>
          </div>
          <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
            <div className="text-teal-200/60 text-xs">Futures Position</div>
            <div className="font-mono text-teal-100 text-lg">-10 ETH</div>
            <div className="text-teal-300/80 text-sm">$18,448.20</div>
          </div>
        </div>

        <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-teal-200/80 text-sm">Delta Exposure</span>
            <span className="text-green-400 font-mono">-0.02</span>
          </div>
          <div className="w-full bg-teal-800/30 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: "98%" }}></div>
          </div>
          <div className="text-teal-300/60 text-xs mt-1">98% Neutral</div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center">
            <div className="text-teal-200/60">Funding APR</div>
            <div className="font-mono text-teal-100">+12.4%</div>
          </div>
          <div className="text-center">
            <div className="text-teal-200/60">Daily PnL</div>
            <div className="font-mono text-green-400">+$3.42</div>
          </div>
          <div className="text-center">
            <div className="text-teal-200/60">Next Rebalance</div>
            <div className="font-mono text-teal-100">2h 15m</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="border-teal-500/20 text-teal-200 hover:bg-teal-500/10 bg-transparent">
            <RotateCcw className="w-4 h-4 mr-2" />
            Rebalance
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">Close Position</Button>
        </div>
      </div>
    </div>
  )
}
