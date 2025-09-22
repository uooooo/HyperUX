import { Button } from "@/components/ui/button"
import { ArrowRight, Zap } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm mb-6">
          <Zap className="h-4 w-4" />
          Prompt → UI → Trade in seconds
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
          Custom Trading UI for <span className="text-primary">Hyperliquid</span>
        </h1>

        <p className="text-lg text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
          Generate personalized trading interfaces optimized for your strategy. From DCA automation to scalping tools -
          create the perfect UX in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-base">
            Start Building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="text-base bg-transparent">
            View Marketplace
          </Button>
        </div>
      </div>
    </section>
  )
}
