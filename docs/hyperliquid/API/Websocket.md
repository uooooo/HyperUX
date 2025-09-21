# Websocket

WebSocket endpoints are available for real-time data streaming and as an alternative to HTTP request sending on the Hyperliquid exchange. The WebSocket URLs by network are:

* Mainnet: `wss://api.hyperliquid.xyz/ws`&#x20;
* Testnet: `wss://api.hyperliquid-testnet.xyz/ws`.

### Connecting

To connect to the WebSocket API, you must establish a WebSocket connection to the respective URL based on your desired network. Once connected, you can start sending subscription messages to receive real-time data updates.

Example from command line:

```
$ wscat -c  wss://api.hyperliquid.xyz/ws
Connected (press CTRL+C to quit)
>  { "method": "subscribe", "subscription": { "type": "trades", "coin": "SOL" } }
< {"channel":"subscriptionResponse","data":{"method":"subscribe","subscription":{"type":"trades","coin":"SOL"}}}
```

Note: this doc uses Typescript for defining many of the message types. If you prefer to use Python, you can check out the equivalent types in the python SDK [here](https://github.com/hyperliquid-dex/hyperliquid-python-sdk/blob/master/hyperliquid/utils/types.py) and example connection code [here](https://github.com/hyperliquid-dex/hyperliquid-python-sdk/blob/master/hyperliquid/websocket_manager.py).
