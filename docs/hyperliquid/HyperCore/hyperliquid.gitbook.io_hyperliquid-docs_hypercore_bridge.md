---
url: "https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/bridge"
title: "Bridge | Hyperliquid Docs"
---

Deposits to the bridge are signed by the validators and are credited when more than 2/3 of the staking power has signed the deposit.

Withdrawals from Hyperliquid are immediately deducted from the L1 balance, and validators sign the withdrawal as separate transactions. When 2/3 of the staking power has signed the withdrawal, an EVM transaction can be sent to the bridge to request the withdrawal.

After a withdrawal is requested, there is a dispute period during which the bridge can be locked for a malicious withdrawal that does not match the Hyperliquid state. Cold wallet signatures of 2/3 of the stake-weighted validator set are required to unlock the bridge.

After the dispute period, finalization transactions are sent, which distribute the USDC to the corresponding destination addresses. There is a similar mechanism to maintain the set of active validators and their corresponding stake on the bridge contract.

Withdrawals do not require any Arbitrum ETH from the user. Instead, a withdrawal gas fee of 1 USDC is paid by the user on Hyperliquid to cover the Arbitrum gas costs of the validators.

The bridge and its logic in relation to the L1 staking have been audited by Zellic. See the Hyperliquid Github repository for the full bridge code, and the [Audits](https://hyperliquid.gitbook.io/hyperliquid-docs/audits) section for the audit reports.

[PreviousOverview](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/overview) [NextAPI servers](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/api-servers)

Last updated 6 months ago