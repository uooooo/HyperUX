# Take profit and stop loss orders (TP/SL)

TP/SL orders close your position when a certain profit (resp. loss) has realized on your position.

The [mark price](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/robust-price-indices) is used to trigger TP/SL orders.&#x20;

TP/SL orders can be dragged on the TradingView chart. Note that dragging in a way that causes the order to immediately execute will lead to an error. Usually this prevents user mistakes, but if this is your desired behavior you can manually close the order from the position table or order form.&#x20;

### Limit vs Market TP/SL orders

Users can choose between TP/SL market and limit orders. TP/SL market orders have a slippage tolerance of 10%.

By setting the limit price on TP/SL orders, users can control the slippage tolerance of a triggered order. The more aggressive the limit price, the more likely the TP/SL order will be filled upon triggering, but the higher the potential slippage upon filling.&#x20;

As a concrete example, a SL order to close a long with trigger price $10 and limit price $10 will hit the book when the mark price drops below $10. If the price drops from $11 to $9 instantly it is quite likely this SL order would rest at $10 instead of filling. However, if the limit price were $8 instead of $10, it's likely to fill at some price between $9 and $8.&#x20;

### TP/SL associated with a position

TP/SL opened from the position form will have a size equal to the entire position by default. These orders will attempt to close the entire position at the time of trigger. If a specific size is configured on these TP/SL orders, they will be fixed-sized (i.e. they will not resize with the position after being placed).

Position TP/SL orders are the most beginner-friendly because they have simple placement and cancelation criteria.

### TP/SL associated with a parent order (a.k.a one-cancels-other, OCO)&#x20;

This style of TP/SL is more complicated. Read the below carefully to avoid unexpected outcomes.

TP/SL opened from the order form have a fixed size equal to the order they are tied to.

If the parent order is fully filled at placement, the children TP and/or SL orders are immediately placed. This behavior is similar to the TP/SL assocated with a position.

When the parent order is not fully filled, the children orders enter an untriggered state. The TP/SL orders have not been placed, and upon cancelation of an unfilled parent order, the child TP/SL orders will be canceled.

If the trader cancels a partially filled parent order, ***the child TP/SL orders are fully canceled as well***. If the trader desires a TP/SL for the partially filled size, they must do so manually, e.g. by placing a separate TP/SL orders associated with the new position.

However, if the parent order is partially filled and then canceled due to insufficient margin, the TP/SL orders will be placed as if the order were fully filled.&#x20;

In conclusion, ***children TP/SL orders associated with a parent order will be placed if and only if the parent order fully fills or is partially filled followed by a cancelation for insufficient margin***.  &#x20;
