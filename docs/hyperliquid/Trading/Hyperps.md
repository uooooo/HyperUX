# Hyperps

### High level summary

*Hyperps* (Hyperliquid-only perps) trade like perpetual contracts that users are familiar with, but do not require an underlying spot or index oracle price. Instead, the funding rate is determined relative to a moving average hyperp mark price in place of the usual spot price. This makes the hyperp price more stable and less susceptible to manipulation, unlike usual pre-launch futures.&#x20;

This new derivative design does not require an underlying asset or index that exists at all points of the hyperp's lifetime, only that the underlying asset or index eventually exists for settlement or conversion.&#x20;

When trading hyperps, funding rates are very important to consider. If there is heavy price momentum in one direction, funding will heavily incentivize positions in the opposite direction for the next eight hours. As always, be sure to understand the contract before trading.

### Conversion to vanilla perps

For a hyperp tracking ABC, shortly after when ABC/USDT is listed on Binance, OKX, or Bybit spot trading, ABC-USD will convert to a normal ABC-USD perp.

### Hyperp mechanism details

Hyperps work just like normal perpetual contracts, except the external spot/index oracle price is replaced with an 8 hour exponentially weighted moving average of the last day's minutely mark prices.&#x20;

Precisely, `oracle_price(t) = min[sum_{i=0}^1439 [(t - i minutes < t_list ? initial_mark_price : mark_price(t - i minutes)) * exp(-i/480)] * (1 - exp(-1/480)) / (1 - exp(-3)), intial_mark_price * 4]`

Here `a ? b : c` evaluates to `b` if `a` is true and otherwise `c.`

Samples are taken on the first block after each unix minute, but the timestamps used are the nearest exact minute multiples. When there are fewer than 480 mark price samples, the initial mark price is used as the padding value.

Funding rate premium samples are computed as 1% of the usual clamped interest rate and premium formula. See Funding docs for more details.

The mark price of Hyperps incorporate the weighted median of pre-launch perp prices from CEXs as a component in the usual mark price formula. Despite the often significantly different contract specifications between hyperps and other venues' pre-launch perp markets, they are nonetheless included as mark price inputs to provide greater mark price stability during volatility.&#x20;

Note that the oracle price is also restricted to be at most 4 times the one month average mark price as an additional safeguard against manipulation.

\\
