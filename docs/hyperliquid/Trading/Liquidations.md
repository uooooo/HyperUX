# Liquidations

### Overview

A liquidation event occurs when a trader's positions move against them to the point where the account equity falls below the maintenance margin. The maintenance margin is half of the initial margin at max leverage, which varies from 3-40x. In other words, the maintenance margin is between 1.25% (for 40x max leverage assets) and 16.7% (for 3x max leverage assets) depending on the asset.

When the account equity drops below maintenance margin, the positions are first attempted to be entirely closed by sending market orders to the book. The orders are for the full size of the position, and may be fully or partially closed. If the positions are entirely or partially closed such that the maintenance margin requirements are met, any remaining collateral remains with the trader.

If the account equity drops below 2/3 of the maintenance margin without successful liquidation through the book, a backstop liquidation happens through the liquidator vault. See Liquidator Vault explanation below for more details.

When a cross position is backstop liquidated, the trader's cross positions and cross margin are all transferred to the liquidator. In particular, if the trader has no isolated positions, the trader ends up with zero account equity.

When an isolated position is backstop liquidated, that isolated position and isolated margin are transferred to the liquidator. The user's cross margin and positions are untouched.

During backstop liquidation, the maintenance margin is not returned to the user. This is because the liquidator vault requires a buffer to make sure backstop liquidations are profitable on average. In order to avoid losing the maintenance margin, traders can place stop loss orders or exit the positions before the mark price reaches the liquidation price.

Liquidations use the mark price, which combines external CEX prices with Hyperliquid's book state. This makes liquidations more robust than using a single instantaneous book price. During times of high volatility or on highly leveraged positions, mark price may be significantly different from book price. It is recommended to use the exact formula for precise monitoring of liquidations.

### Motivation

As described above, the majority of liquidations on Hyperliquid are sent directly to the order book. This allows all users to compete for the liquidation flow, and allows the liquidated user to keep any remaining margin. Unlike CEXs there is no clearance fee on liquidations.&#x20;

The resulting system is transparent and prioritizes retaining as much capital as possible for the liquidated user.

### Partial Liquidations

For liquidatable positions larger than 100k USDC (10k USDC on testnet for easier testing), only 20% of the position will be sent as a market liquidation order to the book. After a block where any position of a user is partially liquidated, there is a cooldown period of 30 seconds. During this cooldown period, all market liquidation orders for that user will be for the entire position.

### Liquidator Vault

Backstop liquidations on Hyperliquid are democratized through the liquidator vault, which is a component strategy of HLP. Positions that are below 2/3 of the maintenance margin can be taken over by the liquidator vault.&#x20;

On average, backstop liquidations are profitable for the liquidator. On most venues, this profit goes to the exchange operator or privileged market makers who internalize the flow. On Hyperliquid, the pnl stream from liquidations go entirely to the community through HLP.&#x20;

### Computing Liquidation Price

When entering a trade, an estimated liquidation price is shown. This estimation may be inaccurate compared to the position's estimated liquidation price due to changing liquidity on the book.

Once a position is opened, a liquidation price is shown. This price has the certainty of the entry price, but still may not be the actual liquidation price due to funding payments or changes in unrealized pnl in other positions (for cross margin positions).

The actual liquidation price is independent on the leverage set for cross margin positions. A cross margin position at lower leverage simply uses more collateral.

The liquidation price does depend on leverage set for isolated margin positions, because the amount of isolated margin allocated depends on the initial margin set.

When there is insufficient margin to make the trade, the liquidation price estimate assumes that the account is topped up to the initial margin requirement.&#x20;

The precise formula for the liquidation price of a position is

`liq_price = price - side * margin_available / position_size / (1 - l * side)`

where

`l = 1 / MAINTENANCE_LEVERAGE` . For assets with margin tiers, maintenance leverage depends on the unique margin tier corresponding to the position value at the liquidation price.

`side = 1 for long and -1 for short`

`margin_available (cross) = account_value - maintenance_margin_required`

`margin_available (isolated) = isolated_margin - maintenance_margin_required`
