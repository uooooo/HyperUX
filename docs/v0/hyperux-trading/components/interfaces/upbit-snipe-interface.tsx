"use client"

import { Button } from "@/components/ui/button"
import { Zap, Twitter, Target, TrendingUp } from "lucide-react"

export function UpbitSnipeInterface() {
  return (
    <div className="space-y-6 border border-teal-500/20 bg-teal-500/5 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <Zap className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-semibold text-teal-100">Upbit Snipe Long</h2>
        <div className="ml-auto text-xs text-teal-300/60">Prompt: "Upbit listing snipe with Twitter alerts"</div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main trading section - left 2/3 */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
              <div className="text-teal-200/60 text-xs">Detected Token</div>
              <div className="font-mono text-teal-100 text-lg">PEPE</div>
              <div className="text-teal-300/80 text-sm">$0.00001234</div>
            </div>
            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
              <div className="text-teal-200/60 text-xs">Position Size</div>
              <div className="font-mono text-teal-100 text-lg">$1,000</div>
              <div className="text-teal-300/80 text-sm">~81M tokens</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
              <div className="text-teal-200/60 text-xs">Market Cap</div>
              <div className="font-mono text-teal-100 text-lg">$12.4M</div>
              <div className="text-teal-300/80 text-sm flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +24.5%
              </div>
            </div>
            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-3">
              <div className="text-teal-200/60 text-xs">FDV</div>
              <div className="font-mono text-teal-100 text-lg">$45.2M</div>
              <div className="text-teal-300/80 text-sm">MC/FDV: 0.27</div>
            </div>
          </div>

          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-2">
            <Target className="w-4 h-4" />
            SNIPE LONG NOW
          </Button>

          <div className="text-center text-teal-300/60 text-xs">Auto-execute in 3.2s if confidence {">"} 85%</div>
        </div>

        <div className="col-span-1">
          <div className="flex justify-between items-center mb-3">
            <span className="text-teal-200/80 text-sm">Twitter Feed</span>
            <div className="bg-blue-600 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
              <Twitter className="w-3 h-3" />
              LIVE
            </div>
          </div>

          <div className="bg-teal-900/10 border border-teal-500/20 rounded p-2 h-64 overflow-y-auto space-y-2">
            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Twitter className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-teal-100 text-xs font-medium">@upbitglobal</div>
                  <div className="text-teal-200/80 text-xs mt-1">New listing: PEPE/KRW</div>
                  <div className="text-teal-300/60 text-xs mt-1">2m ago</div>
                </div>
                <div className="bg-red-600 w-1.5 h-1.5 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <Twitter className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-teal-100 text-xs font-medium">@cryptowhale</div>
                  <div className="text-teal-200/80 text-xs mt-1">PEPE volume spike detected</div>
                  <div className="text-teal-300/60 text-xs mt-1">5m ago</div>
                </div>
              </div>
            </div>

            <div className="bg-teal-900/20 border border-teal-500/20 rounded p-2">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <Twitter className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-teal-100 text-xs font-medium">@listingalerts</div>
                  <div className="text-teal-200/80 text-xs mt-1">Upbit announcement confirmed</div>
                  <div className="text-teal-300/60 text-xs mt-1">8m ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
