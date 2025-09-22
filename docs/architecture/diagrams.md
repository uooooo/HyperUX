---
title: HyperUX Architecture Diagrams
---

## System Context
```mermaid
C4Context
title HyperUX Context
Person(user, "Trader", "Creates and uses generated UIs")
System(hyperux, "HyperUX", "Prompt-to-UI Trade Builder")
System_Ext(hyperliquid, "Hyperliquid", "REST/WS + HyperEVM")
System_Ext(vercel, "Vercel", "Hosting & Functions")

Rel(user, hyperux, "Prompt / Operate UI")
Rel(hyperux, hyperliquid, "Orders/Info via REST/WS; Registry/UISplit on HyperEVM")
Rel(hyperux, vercel, "Deployments / Preview URL")
```

## Container View
```mermaid
flowchart TB
  subgraph FE[Frontend: Next.js App Router]
    Chat[Chat / Prompt]
    Validator[Zod: UI DSL Validation]
    TradeUI[Generated Trade UI]
    Wallet[Reown AppKit]
  end

  subgraph BE[Vercel Functions (Node runtime)]
    APIOrder[/api/order\nBuilder Code Enforcer/]
    APIRegistry[/api/registry/*/]
    APIDeploy[/api/deploy/]
  end

  subgraph HL[Hyperliquid]
    HLAPI[(REST / WS)]
    HLEVM[(HyperEVM: Registry / UISplit)]
  end

  Chat --> Validator --> TradeUI
  Wallet -. Auth/Sign .- TradeUI
  TradeUI -->|Orders| APIOrder --> HLAPI
  APIRegistry <--> HLEVM
  APIDeploy --> HLEVM
```

## Component View（/api/order）
```mermaid
sequenceDiagram
  participant FE as Frontend
  participant OE as Order Enforcer (/api/order)
  participant REG as Registry Reader
  participant HL as Hyperliquid Exchange

  FE->>OE: POST /api/order {orders, f?}, x-bundle-hash
  OE->>REG: bundleHash → splitAddress
  REG-->>OE: splitAddress, fMax
  OE->>OE: validate + quantize sizes (min lot)
  OE->>HL: exchange(order, b=split, f=min(user,fMax))
  HL-->>OE: result
  OE-->>FE: result
```

## Deployment View（Preview-based）
```mermaid
flowchart LR
  Dev[Dev / CI] --> Vercel[Vercel Deploy]
  Vercel --> Preview[Preview URL (immutable)]
  Preview --> Users[Users]
```

