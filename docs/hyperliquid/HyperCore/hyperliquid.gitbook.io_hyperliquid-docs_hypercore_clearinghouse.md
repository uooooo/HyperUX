---
url: "https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/clearinghouse"
title: "Clearinghouse | Hyperliquid Docs"
---

The perps clearinghouse is a component of the execution state on HyperCore. It manages the perps margin state for each address, which includes balance and positions.

Deposits are first credited to an address's cross margin balance. Positions by default are also opened in cross margin mode. Isolated margin is also supported, which allows users to allocate margin towards a specific position, disassociating the liquidation risk of that position with all other positions.

The spot clearinghouse analogously manages spot user state for each address, including token balances and holds.

[PreviousAPI servers](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/api-servers) [NextOracle](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/oracle)

Last updated 6 months ago