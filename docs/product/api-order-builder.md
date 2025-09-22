# `/api/order` Builder Relay Implementation

This note captures the code added for Issue #5 and documents the execution flow at a function level so future maintainers can reason about the handler quickly.

## Overview of Created/Updated Files

- `frontend/src/app/api/order/route.ts` – Next.js App Router handler for POST `/api/order`. Performs validation, builder enforcement, size quantisation, idempotency, and delegates to Hyperliquid.
- `frontend/src/server/hyperliquid/assets.ts` – Caches `meta.universe` results, tracks `assetId` + `szDecimals`, provides helpers for quantising and computing minimum base size units.
- `frontend/src/server/hyperliquid/exchange.ts` – Provides preconfigured Hyperliquid SDK clients (HTTP transport for exchange actions, HTTP+keepalive=false for info queries).
- `frontend/src/server/registry.ts` – In-memory registry mock, now normalises builder split addresses.
- `frontend/requests/api-order.http` – HTTP examples demonstrating success, idempotent replay, and schema validation failures.
- `docs/hyperliquid/API/order-relay-notes.md` – Operational notes for the handler (transport strategy, normalisation behaviour).

## Handler Flow (`frontend/src/app/api/order/route.ts`)

### 1. Request Entry & Header Validation
- `POST(request: NextRequest)` is the export consumed by Next.js.
- It first validates required headers through `HEADER_SCHEMA` (bundle hash, wallet address, idempotency key). Invalid headers short-circuit with HTTP 400.

### 2. Idempotency Guard
- Idempotency keys are trimmed via `normalizeIdempotencyKey` and cached inside `idempotencyCache` (TTL 60 seconds).
- If the key already exists and has not expired, the cached response (success or error) is replayed immediately.

### 3. Body Parsing & Schema Validation
- The raw body is parsed; parsing failures are cached as 400 responses.
- `ORDER_REQUEST_SCHEMA` + nested `ORDER_SCHEMA` ensure:
  - A non-empty order list.
  - Each order provides either `size` or (`sizeUsd` + `price`).
  - Limit orders always include a `price`.
  - `clientId` is a 32-hex-value (Hyperliquid cloid requirement).

### 4. Configuration Checks
- The handler aborts with 501 if `HYPERLIQUID_API_PRIVATE_KEY` is missing (deployment not configured for trading).

### 5. Registry & Builder Enforcement
- Loads the registry entry with `lookupBundle(bundleHash)`. Missing record → 403.
- Calculates enforced builder fee `min(f request, registry.fMax)`.
- If `builderFee > 0`, calls `ensureBuilderFeeWithinLimit` which uses `getHttpInfoClient().maxBuilderFee` to confirm the user’s approval for the builder.

### 6. Order Normalisation Loop
For each submitted order:
1. Retrieve market metadata using `getPerpAssetMeta(order.market)`; returns `{ assetId, szDecimals }` from the cached Info client.
2. Convert incoming size into base units with `computeBaseSize(order, szDecimals)`:
   - Handles both `size` and `sizeUsd` via Decimal math.
   - Floors the size to the allowed number of decimals with `quantizeSize`.
   - Throws if the resulting quantity is zero/negative, flagging sub-minimum orders.
3. Price is normalised using `ensurePrice` (and turned into a string via `decimalToString`).
4. Builds the SDK `OrderParams` struct and optionally appends the client order ID (`c`).
5. Records a `NormalizedOrderInfo` entry containing market, `assetId`, `szDecimals`, quantised size, and computed `minSize` (`10^-szDecimals`). This array is returned to the caller for UI display.

### 7. Hyperliquid Execution
- `getExchangeClient()` returns an `ExchangeClient` wired to the HTTP transport (`keepalive=false`).
- `exchangeClient.order(...)` is invoked with the enforced builder code when necessary.
- Successful responses are cached along with `normalizedOrders` and echoed to the client.

### 8. Error Handling
- All thrown errors funnel into `handleError(error, idempotencyKey, normalizedOrders)`.
- `HttpError`, `ApiRequestError`, and `TransportError` cases map to specific HTTP status codes (e.g. price-out-of-range → 422; builder issues → 403).
- The error payloads include `normalizedOrders` when available, helping clients understand the quantised size that was attempted even on failure.

## Supporting Utilities

### `ensureBuilderFeeWithinLimit`
- Uses the HTTP Info client (keepalive disabled) to query Hyperliquid’s builder approval.
- Converts SDK errors into `HttpError(403, ...)` so all builder failures present consistently.

### `getPerpAssetMeta` & `refreshMetaIfNeeded`
- Caches the Info endpoint’s `meta.universe` for 60 seconds.
- Stores both `assetId` (array index) and `szDecimals` per market, enabling quick lookups within the order loop.

### `quantizeSize` & `minSizeFromDecimals`
- `quantizeSize(value, szDecimals)` floors Decimal values to comply with Hyperliquid lot sizes.
- `minSizeFromDecimals(szDecimals)` returns the smallest positive base unit (e.g. `1e-5` for `szDecimals = 5`).

## Testing & Tooling

- Manual verification: `frontend/requests/api-order.http` contains ready-to-run examples (success, idempotent replay, schema failure).
- Automated checks: `bun run lint` and `bun run build` must pass before shipping.

## Next Steps / Recommendations

- Optionally add price tick-size enforcement if the UI needs server-side validation for price increments.
- Expand automated coverage (e.g. Vitest/MSW) to exercise builder fee approvals, idempotency cache hits, and min-size failures.
