# Robust price indices

Hyperliquid makes use of several robust prices based on order book and external data to minimize risk of market manipulation.

*Oracle price* is used to compute funding rates. This weighted median of CEX prices is robust because it does not depend on hyperliquid's market data at all. Oracle prices are updated by the validators approximately once every three seconds.

*Mark price* is the median of the following prices:

1. Oracle price plus a 150 second exponential moving average (EMA) of the difference between Hyperliquid's mid price and the oracle price
2. The median of best bid, best ask, last trade on Hyperliquid
3. Median of Binance, OKX, Bybit, Gate IO, MEXC perp mid prices with weights 3, 2, 2, 1, 1, respectively

If exactly two out of the three inputs above exist, the 30 second EMA of the median of best bid, best ask, and last trade on Hyperliquid is also added to the median inputs.

Mark price is an unbiased and robust estimate of the fair perp price, and is used for margining, liquidations, triggering TP/SL, and computing unrealized pnl. Mark price is updated whenever validators publish new oracle prices. Therefore, mark and oracle price are updated approximately once every 3 seconds.

The EMA update formula is defined as follows for an update value of `sample` at duration `t` since the last update

`ema = numerator / denominator`

`numerator -> numerator * exp(-t / 2.5 minutes) + sample * t`&#x20;

`denominator -> denominator * exp(-t / 2.5 minutes) + t`
