# Entry price and pnl

On the Hyperliquid DEX, entry price, unrealized pnl, and closed pnl are purely frontend components provided for user convenience. The fundamental accounting is based on margin (balance for spot) and trades.&#x20;

### Perps

Perp trades are considered `opening` when the absolute value of the position increases. In other words, longing when already long or shorting when already short.

For opening trades, the entry price is updated to an average of current entry price and trade price weighted by size.

For closing trades, the entry price is kept the same.

Unrealized pnl is defined as `side * (mark_price - entry_price) * position_size` where `side = 1` for a long position and `side = -1` for a short position

Closed pnl is `fee + side * (mark_price - entry_price) * position_size` for a closing trade and only the fee for an opening trade.

### Spot

Spot trades use the same formulas as perps with the following modifications: Spot trades are considered `opening` for buys and `closing` for sells. Transfers are treated as buys or sells at mark price, and genesis distributions are treated as having entry price at `10000 USDC` market cap. Note that while 0 is the correct answer as genesis distributions are not bought, it leads to undefined return on equity.&#x20;

Pre-existing spot balances are assigned an entry price equal to the first trade or send after the feature was enabled around July 3 08:00 UTC.
