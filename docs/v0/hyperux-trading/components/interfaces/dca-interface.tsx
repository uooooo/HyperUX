"use client"

import { Button } from "@/components/ui/button"
import { Bitcoin } from "lucide-react"

export function DCAInterface() {
  return (
    <div className="space-y-6 border border-teal-500/20 bg-teal-500/5 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <Bitcoin className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-semibold text-teal-100">Bitcoin Weekly DCA</h2>
        <div className="ml-auto text-xs text-teal-300/60">Prompt: "Bitcoin weekly buying, $100 budget"</div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-teal-200/80 text-sm">Weekly Progress</span>
            <span className="text-sm font-mono text-teal-100">$75/$100</span>
          </div>
          <div className="h-2 bg-teal-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: "75%" }} />
          </div>
          <div className="text-xs text-teal-300/60 mt-1">Next purchase: 2 days</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-mono text-teal-100">$36,450.28</div>
            <div className="text-teal-200/80 text-sm">Current BTC</div>
          </div>
          <div>
            <div className="text-2xl font-mono text-teal-100">$34,892.15</div>
            <div className="text-teal-200/80 text-sm">Avg. Cost</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-teal-200/80">Total: 0.0043 BTC</span>
          <span className="text-green-400 font-mono">+4.5% ($156.73)</span>
        </div>

        <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white">Buy Bitcoin Now</Button>
      </div>
    </div>
  )
}
