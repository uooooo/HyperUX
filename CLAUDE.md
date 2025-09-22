# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HyperUX is a Next.js application for generating Hyperliquid-optimized trading UIs from prompts, with Bundle Hash × EIP-712 author verification and Builder Code Split revenue distribution. The stack includes Next.js App Router, Reown AppKit, and @nktkas/hyperliquid SDK for safe order relay to Hyperliquid.

## Development Commands

**Frontend (primary workspace):**
```bash
cd frontend
bun install          # Install dependencies
bun run dev          # Start development server with turbopack
bun run build        # Build for production with turbopack  
bun run start        # Start production server
bun run lint         # Run ESLint
```

**Package Manager:** Bun is recommended (bun.lockb included), but npm/yarn also work.

**Critical:** Always run `bun run lint` and `bun run build` before creating PRs.

## Architecture Overview

### Core Components

**UI DSL System:** 
- Schema definition: `frontend/src/lib/ui-dsl/schema.ts` - Zod schemas for trading UI components
- Component types: OrderPanel, RiskCard, FundingCard, PnLCard, Chart, Alerts, etc.
- Samples: `frontend/src/lib/ui-dsl/samples.ts`
- Renderer: `frontend/src/components/ui-dsl/renderer.tsx`

**Hyperliquid Integration:**
- REST/WS clients: `frontend/src/lib/hyperliquid/client.ts`
- Service layer: `frontend/src/lib/hyperliquid/service.ts` - Asset contexts, funding data
- WebSocket manager: `frontend/src/lib/hyperliquid/ws-manager.ts`
- React hooks: `frontend/src/lib/hyperliquid/hooks.ts`

**Order Processing:**
- API route: `frontend/src/app/api/order/route.ts` (Node runtime)
- Registry: `frontend/src/server/registry.ts` - Bundle hash to split address mapping
- Exchange client: `frontend/src/server/hyperliquid/exchange.ts`
- Asset resolution: `frontend/src/server/hyperliquid/assets.ts`

**Wallet Integration:**
- Reown AppKit config: `frontend/src/config/appkit.ts`
- Context provider: `frontend/src/context/index.tsx`
- Layout integration: `frontend/src/app/layout.tsx`

### Key Patterns

**Route Structure:**
- `/` - Main landing page
- `/t/[bundleHash]` - Template rendering by bundle hash
- `/api/order` - Server-side order processing

**Security Model:**
- Bundle Hash authorization via registry lookup
- Builder fee enforcement on server side
- Idempotency key protection against double execution
- Environment-based configuration isolation

## Environment Variables

**Required:**
- `NEXT_PUBLIC_PROJECT_ID` - Reown AppKit project ID
- `HYPERLIQUID_API_URL` - Hyperliquid API endpoint  
- `HYPERLIQUID_WS_URL` - Hyperliquid WebSocket endpoint
- `HYPEREVM_RPC_URL` - HyperEVM RPC endpoint

**Optional:**
- `HYPERLIQUID_API_PRIVATE_KEY` - For order execution
- `HYPERLIQUID_DEFAULT_SPLIT_ADDRESS` - Default builder split address
- `HYPERLIQUID_DEFAULT_MAX_BUILDER_FEE` - Default max builder fee

**File Locations:**
- `frontend/.env.local` - Local development environment

## Testing & Quality

**Lint Requirements:** ESLint configuration in `frontend/eslint.config.mjs`

**Build Requirements:** Next.js with Turbopack support

**Critical APIs:**
- `/api/order` endpoint requires comprehensive error handling
- WebSocket connections need reconnection logic
- UI DSL validation must cover all component schemas

## Git Workflow

**Branch Naming:** `<type>/<issue-number>-<slug>`
- Example: `feat/123-send-to-email`, `fix/456-proof-retry`

**Commit Convention:** Conventional Commits with Issue reference
- Example: `feat(send): add /api/send (#123)`

**PR Requirements:**
- Link to Issue with `Closes #123`
- Pass lint and build checks
- Include component screenshots for UI changes

## Task Management

**GitHub Issues + Task Markdown:**
- Issues tracked in `/task/*.md` files
- Bidirectional linking between Issues and task files
- Current active tasks visible in `/task/` directory

**Issue-Driven Development:**
- Each feature starts with a GitHub Issue
- Task breakdown in corresponding `/task/<number>-<slug>.md`
- Branch created from Issue number

## Architecture Notes

**Node Runtime:** API routes use `export const runtime = "nodejs"` for Hyperliquid SDK compatibility

**State Management:** React Query for server state, React Context for wallet state

**Component Architecture:** UI DSL components are rendered dynamically based on schema validation

**Error Handling:** Structured error responses with appropriate HTTP status codes and idempotency support

## Documentation References

Core documentation in `AGENTS.md` provides comprehensive project guidelines including security, deployment, and AI agent workflows.