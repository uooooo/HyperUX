# Contract specifications

Hyperliquid perpetuals are derivatives products without expiration date. Instead, they rely on funding payments to ensure convergence to the underlying spot price over time. See [funding](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/funding "mention") for more information.&#x20;

Hyperliquid has one main style of margining for perpetual contracts: USDC margining, USDT denominated linear contracts. That is, the oracle price is denominated in USDT, but the collateral is USDC. This allows for the best combination of liquidity and accessibility. Note that no conversions with the USDC/USDT exchange rate are applied, so these contracts are technically quanto contracts where USDT pnl is denominated in USDC.

When the spot asset's primary source of liquidity is USDC denominated, the oracle price is denominated in USDC. Currently, the only USDC-denominated perpetual contracts are PURR-USD and HYPE-USD, where the most liquid spot oracle source is Hyperliquid spot.

Hyperliquid's contract specifications are simpler than most platforms. There are few contract-specific details and no address-specific restrictions.

|                             |                                                                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Instrument type             | Linear perpetual                                                                                                                           |
| Contract                    | 1 unit of underlying spot asset                                                                                                            |
| Underlying asset / ticker   | Hyperliquid oracle index of underlying spot asset                                                                                          |
| Initial margin fraction     | 1 / (leverage set by user)                                                                                                                 |
| Maintenance margin fraction | Half of maximum initial margin fraction                                                                                                    |
| Mark price                  | See [here](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices)                                                   |
| Delivery / expiration       | N/A (funding payments every hour)                                                                                                          |
| Position limit              | N/A                                                                                                                                        |
| Account type                | Per-wallet cross or isolated margin                                                                                                        |
| Funding impact notional     | <p>20000 USDC for BTC and ETH</p><p>6000 USDC for all other assets </p>                                                                    |
| Maximum market order value  | $15,000,000 for max leverage >= 25, $5,000,000 for max leverage in \[20, 25), $2,000,000 for max leverage in \[10, 20), otherwise $500,000 |
| Maximum limit order value   | 10 \* maximum market order value                                                                                                           |
