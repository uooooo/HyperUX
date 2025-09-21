# Funding

### Overview

Funding rates for crypto perpetual contracts are a mechanism that is used to ensure the price of the contract stays close to the underlying asset's price.&#x20;

The funding rate is a periodic fee that is paid by one side of the contract (either long or short) to the other side. Funding is purely peer-to-peer and no fees are collected on the payments.

The rate is calculated based on the difference between the contract's price and the spot price of the underlying asset. For consistency with CEXs, interest rate component is predetermined at 0.01% every 8 hours, which is 0.00125% every hour, or 11.6% APR paid to short. This represents the difference in cost to borrow USD versus spot crypto.&#x20;

The premium component fluctuates based on the difference between the perpetual contract's price and the underlying spot oracle price. If the contract's price is higher than the oracle price, the premium and hence the funding rate will be positive, and the long position will pay the short position. Conversely, if the contract's price is lower than the spot price, the funding rate will be negative, and the short position will pay the long position.

The funding rate on Hyperliquid is paid every hour. The funding rate is added or subtracted from the balance the contract holders at the funding interval.

Funding rates are designed to prevent large price disparities between the perpetual contract and the underlying asset. When the funding rate is high, it can incentivize traders to take the opposite position and help to bring the contract's price closer to the spot price of the underlying asset.

### Technical details

Funding on Hyperliquid is designed to closely match the process used by centralized perpetual exchanges.&#x20;

The funding rate formula applies to 8 hour funding rate. However, funding is paid every hour at one eighth of the computed rate for each hour.

The specific formula is `Funding Rate (F) = Average Premium Index (P) + clamp (interest rate - Premium Index (P), -0.0005, 0.0005)`. The premium is sampled every 5 seconds and averaged over the hour.

As described in the [clearinghouse](https://hyperliquid.gitbook.io/hyperliquid-docs/hypercore/clearinghouse) section, the oracle prices are computed by each validator as the weighted median of CEX spot prices for each asset, with weights depending on the liquidity of the CEX.&#x20;

`premium = impact_price_difference / oracle_price`&#x20;

where&#x20;

`impact_price_difference = max(impact_bid_px - oracle_px, 0) - max(oracle_px - impact_ask_px, 0)`&#x20;

and `impact_bid_px` and `impact_ask_px` are the average execution prices to trade`impact_notional_usd` on the bid and ask sides, respectively. See the contract specifications for the impact notional used, as well as other contract specific parameters.

Funding on Hyperliquid is capped at 4%/hour. Note that this is much less aggressive capping than CEX counterparts. The funding cap and funding interval do not depend on the asset.&#x20;

Note that the funding payment at the end of the interval is `position_size * oracle_price * funding_rate`. In particular, the spot oracle price is used to convert the position size to notional value, *not the mark price.*

### Numerical Example

Here is an explicit example computation:

1. The interest rate is 0.01% (fixed).
2. The perpetual contract is trading at a premium, with the impact bid price being $10,100, and the spot price at $10,000.
3. The premium index is calculated as the difference between the two prices, which is $100 in this case.
4. The funding interval is 1 hour.
5. You hold a long position of 10 contracts, each representing 1 BTC.

First, calculate the premium:

Premium = (Impact bid price - Spot Price) / Spot Price = ($10,100 - $10,000) / $10,000 Premium = 0.01 (or 1%)

Next, clamp the interest rate minus the premium rate at 0.05%:

Clamped Difference = min(max(Interest Rate - Premium Rate, -0.05%), 0.05%)&#x20;

Clamped Difference = min(max(0.01% - 1%, -0.05%), 0.05%)&#x20;

Clamped Difference = min(max(-0.99%, -0.05%), 0.05%) Clamped Difference = -0.05%

Now, calculate the funding rate:

Funding Rate = Premium Rate + Clamped Difference Funding Rate = 1% + (-0.05%)&#x20;

Funding Rate = 0.95%
