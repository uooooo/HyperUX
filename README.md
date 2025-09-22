# HyperUX

HyperUX turns natural-language trading prompts into tailor-made Hyperliquid frontends. The current hackathon build wires up the page scaffolds and the server order relay.

## Current Footprint (Issue #6)

- `/` &mdash; Prompt form + sample bundle selector → routes to `/t/[bundleHash]`.
- `/t/[bundleHash]` &mdash; Renders the selected UI DSL via `UiDslRenderer`, with a KPI bar placeholder.
- `/market` &mdash; Lists sample bundles (mock registry entries) with quick preview links.
- `/api/order` &mdash; Builder-enforced Hyperliquid relay (Issue #5).

## Verified Post-#6 Smoke Test

```
bun run lint
bun run build
```

Manual navigation: Home → Trade (bundle rendered) → Market (list + preview links).

## Next Milestones

| Priority | Scope | Issue | Task |
| -------- | ----- | ----- | ---- |
| P0 | LLM prompt → UI DSL | #16 | `task/7-llm-integration.md` |
| P0 | Hyperliquid data + order wiring | #17 | `task/8-hyperliquid-binding.md` |
| P0 | UI polish & wallet header perf | #18 | `task/9-ui-polish.md` |
| P0 | Deploy generated bundles to Vercel | #19 | `task/14-user-generated-deploy.md` |
| P0 | BundleHash verification pipeline | #20 | `task/15-bundlehash-verification.md` |
| P1 | App Vercel deploy & env wiring | #12 | `task/11-vercel-deploy.md` |
| P1 | On-chain registry + EIP-712 | #13 | `task/12-onchain-registry.md` |
| P1 | Contract tests (MSW/Vitest) | #14 | `task/13-contract-tests.md` |

Legacy scaffolding checklists are in `task/2-6*.md`.

## Local Commands

- `bun install`
- `bun run dev`
- `bun run lint`
- `bun run build`

Environment var templates live in `frontend/.env.example`.
