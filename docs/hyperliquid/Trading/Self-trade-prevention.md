# Self-trade prevention

Trades between the same address cancel the resting order instead of causing a fill. No fees are deducted, nor does the the cancel show up in the trade feed.

On CEXs this behavior is often labeled as "expire maker." This is a commonly preferred behavior for market making algorithms, where the aggressing order would like to continue getting fills against liquidity behind the maker order up until the limit price.
