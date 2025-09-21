# Order types

### Order types:

* Market: An order that executes immediately at the current market price
* Limit: An order that executes at the selected limit price or better
* Stop Market: A market order that is activated when the price reaches the selected stop price. Stop orders are generally used to help limit losses and lock in profits&#x20;
* Stop Limit: A limit order that is activated when the price reaches the selected stop price&#x20;
* Scale: Multiple limit orders in a set price range &#x20;
* TWAP: A large order divided into smaller suborders and executed in 30 second intervals. TWAP suborders have a maximum slippage of 3%&#x20;

### TWAP details:&#x20;

During execution, a TWAP order attempts to meet an execution target which is defined as the elapsed time divided by the total time times the total size. A suborder is sent every 30 seconds during the course of the TWAP.&#x20;

A suborder is constrained to have a max slippage of 3%. When suborders do not fully fill because of market conditions (e.g., wide spread, low liquidity, etc.), the TWAP may fall behind its execution target. In this case, the TWAP will try to catch up to this execution target during later suborders. These later suborders will be larger but subject to the constraint of 3 times the normal suborder size (defined as total TWAP size divided by number of suborders). It is possible that if too many suborders did not fill then the TWAP order may not fully catch up to the total size by the end. Like normal market orders, TWAP suborders do not fill during the post-only period of a network upgrade.

### Order options:

* Reduce Only: An order that reduces a current position as opposed to opening a new position in the opposite direction&#x20;
* Good Til Cancel (GTC): An order that rests on the order book until it is filled or canceled&#x20;
* Post Only (ALO): An order that is added to the order book but doesn’t execute immediately. It is only executed as a resting order
* Immediate or Cancel (IOC): An order that will be canceled if it is not immediately filled
* Take Profit: An order that triggers when the Take Profit (TP) price is reached.
* Stop Loss: An order that triggers when the Stop Loss (SL) price is reached
* TP and SL orders are often used by traders to set targets and protect profits or minimize losses on positions. TP and SL are automatically market orders. You can set a limit price and configure the amount of the position to have a TP or SL
