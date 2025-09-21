---
url: "https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/api-servers"
title: "API servers | Hyperliquid Docs"
---

API servers listen to updates from a node and maintains the blockchain state locally. The API server serves information about this state and also forwards user transactions to the node. The API serves two sources of data, REST and Websocket.

When user transactions are sent to an API server, they are forwarded to the connected node, which then gossips the transaction as part of the HyperBFT consensus algorithm. Once the transaction has been included in a committed block on the L1, the API server responds to the original request with the execution response from the L1.

[PreviousBridge](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/bridge) [NextClearinghouse](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/clearinghouse)

Last updated 6 months ago