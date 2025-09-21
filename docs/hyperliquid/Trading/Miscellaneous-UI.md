# Miscellaneous UI

### Max Drawdown

The max drawdown on the portfolio page is only used on the frontend for users' convenience. It does not affect any margining or computations on Hyperliquid. Users who care about the precise formula can get their account value and pnl history and compute it however they choose.

The formula used on the frontend is the maximum over times `end > start` of the value `(pnl(end) - pnl(start)) / account_value(start)`&#x20;

Note that the denominator is account value and the numerator is pnl. Also note that this not equal to absolute max drawdown divided by some account value. Each possible time range considered uses its own denominator.&#x20;
