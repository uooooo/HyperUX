"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp } from "lucide-react"

export function ScalpingInterface() {
  return (
    <div className="space-y-6 border border-teal-500/20 bg-teal-500/5 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-semibold text-teal-100">ETH Scalping</h2>
        <div className="ml-auto text-xs text-teal-300/60">Prompt: "Scalping ETHUSDT with 0.1% targets"</div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-mono text-teal-100">$1,845.26</div>
            <div className="text-teal-200/80 text-sm">ETHUSDT</div>
          </div>
          <div className="text-right">
            <div className="text-red-400 text-sm font-mono">-0.08%</div>
            <div className="text-xs text-teal-300/60">1m | 5m | 15m</div>
          </div>
        </div>

        <div className="h-20 bg-teal-900/20 rounded border border-teal-500/20 p-2">
          <div className="h-full flex items-end justify-between gap-1">
            {[12, 8, 15, 22, 18, 25, 20, 28, 24, 30, 26, 32, 28, 35, 31, 38, 34, 40, 36, 42].map((height, i) => (
              <div key={i} className="bg-teal-400/60 w-1 rounded-sm transition-all" style={{ height: `${height}%` }} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="$100"
            className="bg-teal-900/20 border-teal-500/30 text-teal-100 placeholder:text-teal-300/40"
          />
          <Button className="bg-green-600 hover:bg-green-700 text-white">LONG</Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">SHORT</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-teal-200/80">Today's PnL</div>
            <div className="text-green-400 font-mono">+$27.83</div>
          </div>
          <div>
            <div className="text-teal-200/80">Positions</div>
            <div className="text-teal-100 font-mono">2</div>
          </div>
          <div>
            <div className="text-teal-200/80">Target</div>
            <div className="text-teal-100 font-mono">0.1%</div>
          </div>
        </div>
      </div>
    </div>
  )
}
