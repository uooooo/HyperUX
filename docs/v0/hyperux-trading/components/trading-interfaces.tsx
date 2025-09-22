"use client"

import { useState } from "react"
import { DCAInterface } from "./interfaces/dca-interface"
import { ScalpingInterface } from "./interfaces/scalping-interface"
import { ArbitrageInterface } from "./interfaces/arbitrage-interface"
import { PortfolioInterface } from "./interfaces/portfolio-interface"
import { UpbitSnipeInterface } from "./interfaces/upbit-snipe-interface"
import { DeltaNeutralInterface } from "./interfaces/delta-neutral-interface"

export function TradingInterfaces() {
  const [activeInterface, setActiveInterface] = useState<string | null>(null)

  const interfaces = [
    { id: "dca", component: DCAInterface, title: "Bitcoin Weekly DCA" },
    { id: "scalping", component: ScalpingInterface, title: "ETH Scalping" },
    { id: "arbitrage", component: ArbitrageInterface, title: "Arbitrage Monitor" },
    { id: "upbit-snipe", component: UpbitSnipeInterface, title: "Upbit Snipe Long" },
    { id: "delta-neutral", component: DeltaNeutralInterface, title: "Delta Neutral" },
    { id: "portfolio", component: PortfolioInterface, title: "Portfolio Manager" },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {interfaces.map(({ id, component: Component, title }) => (
          <div key={id} className="trading-card">
            <Component />
          </div>
        ))}
      </div>
    </div>
  )
}
