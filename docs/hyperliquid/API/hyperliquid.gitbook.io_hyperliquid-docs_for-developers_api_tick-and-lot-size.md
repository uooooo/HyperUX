---
url: "https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size"
title: "Tick and lot size | Hyperliquid Docs"
---

Both Price (px) and Size (sz) have a maximum number of decimals that are accepted.

Prices can have up to 5 significant figures, but no more than `MAX_DECIMALS - szDecimals` decimal places where `MAX_DECIMALS` is 6 for perps and 8 for spot. Integer prices are always allowed, regardless of the number of significant figures. E.g. `123456` is a valid price even though `12345.6` is not.

Sizes are rounded to the `szDecimals` of that asset. For example, if `szDecimals = 3` then `1.001` is a valid size but `1.0001` is not.

`szDecimals` for an asset is found in the meta response to the info endpoint

### [Direct link to heading](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size\#perp-price-examples)    Perp price examples

`1234.5` is valid but `1234.56` is not (too many significant figures)

`0.001234` is valid, but `0.0012345` is not (more than 6 decimal places)

If `szDecimals = 1` , `0.01234` is valid but `0.012345` is not (more than `6 - szDecimals ` decimal places)

### [Direct link to heading](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size\#spot-price-examples)    Spot price examples

`0.0001234` is valid if `szDecimals` is 0 or 1, but not if `szDecimals` is greater than 2 (more than 8-2 decimal places).

### [Direct link to heading](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size\#signing)    Signing

Note that if implementing signing, trailing zeroes should be removed. See [Signing](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/signing) for more details.

[PreviousAsset IDs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/asset-ids) [NextNonces and API wallets](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/nonces-and-api-wallets)

Last updated 3 months ago