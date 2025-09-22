"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DCAInterface } from "@/components/trading-interfaces/dca-interface"
import { ScalpingInterface } from "@/components/trading-interfaces/scalping-interface"
import { ArbitrageInterface } from "@/components/trading-interfaces/arbitrage-interface"
import { TrendingUp, Zap, BarChart3 } from "lucide-react"

type UseCase = "dca" | "scalping" | "arbitrage"

const useCases = [
  {
    id: "dca" as UseCase,
    title: "DCA Beginner",
    description: "Simple, safe dollar-cost averaging with automated alerts",
    icon: TrendingUp,
    features: ["Low information density", "Safety guards", "Automated execution"],
    color: "bg-chart-1",
  },
  {
    id: "scalping" as UseCase,
    title: "Day Trader",
    description: "High-speed scalping with one-click execution and hotkeys",
    icon: Zap,
    features: ["One-click orders", "Hotkey support", "Real-time data"],
    color: "bg-primary",
  },
  {
    id: "arbitrage" as UseCase,
    title: "Arbitrage Trader",
    description: "Multi-exchange price monitoring and arbitrage opportunities",
    icon: BarChart3,
    features: ["Price comparison", "Opportunity alerts", "Multi-exchange"],
    color: "bg-chart-3",
  },
]

export function UseCaseSelector() {
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)

  const renderInterface = () => {
    switch (selectedUseCase) {
      case "dca":
        return <DCAInterface />
      case "scalping":
        return <ScalpingInterface />
      case "arbitrage":
        return <ArbitrageInterface />
      default:
        return null
    }
  }

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Trading Style</h2>
          <p className="text-muted-foreground text-lg">Select a use case to see a customized trading interface</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {useCases.map((useCase) => {
            const Icon = useCase.icon
            const isSelected = selectedUseCase === useCase.id

            return (
              <Card
                key={useCase.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? "ring-2 ring-primary shadow-lg" : ""
                }`}
                onClick={() => setSelectedUseCase(useCase.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${useCase.color}/20`}>
                      <Icon className={`h-5 w-5 text-${useCase.color.replace("bg-", "")}`} />
                    </div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {useCase.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button className="w-full mt-4" variant={isSelected ? "default" : "outline"}>
                    {isSelected ? "Selected" : "Try This Style"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {selectedUseCase && (
          <div className="mt-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">
                {useCases.find((uc) => uc.id === selectedUseCase)?.title} Interface
              </h3>
              <p className="text-muted-foreground">This is how your custom trading UI would look</p>
            </div>
            {renderInterface()}
          </div>
        )}
      </div>
    </section>
  )
}
