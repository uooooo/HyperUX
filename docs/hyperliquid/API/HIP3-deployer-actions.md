# HIP-3 deployer actions

The API for deploying and operating builder-deployed perpetual dexs involves the following L1 action:

```typescript
type PerpDeployAction =
  | {
      type: "perpDeploy",
      registerAsset: RegisterAsset,
    }
  | {
      type: "perpDeploy",
      setOracle: SetOracle,
    }
  | {
      type: "perpDeploy",
      setFundingMultipliers: SetFundingMultipliers,
    }
  | {
      type: "perpDeploy",
      haltTrading: { coin: string, isHalted: boolean },
    };
    
/**
 * RegisterAsset can be called to initialize a new dex and register an asset at the same time.
 * If schema is not provided, then RegisterAsset can be called multiple times to register additional assets
 * for the provided dex.
 * @param maxGas - Max gas in native token wei. If not provided, then uses current deploy auction price.
 * @param assetRequest - Contains new asset listing parameters. See RegisterAssetRequest below for details.
 * @param dex - Name of the perp dex (<= 6 characters)
 * @param schema - Contains new perp dex parameters. See PerpDexSchemaInput below for details.
 */
type RegisterAsset = {
  maxGas?: number;
  assetRequest: RegisterAssetRequest;
  dex: string;
  schema?: PerpDexSchemaInput;
}

/**
 * The markPxs outer list can be length 0, 1, or 2. The median of these inputs
 * along with the local mark price (median(best bid, best ask, last trade price))
 * is used as the new mark price update.
 *
 * SetOracle can be called multiple times but there must be at least 2.5 seconds between calls.
 *
 * Stale mark prices will be updated to the local mark price after 10 seconds of no updates.
 * This fallback counts as an update for purposes of the maximal update frequency.
 * This fallback behavior should not be relied upon. Deployers are expected to call setOracle every 3 seconds even with no changes.
 *
 * Each update can change oraclePx and markPx by at most 1%.
 * The markPx cannot be updated such that open interest would be 10x the open interest cap.
 * @param dex - Name of the perp dex (<= 6 characters)
 * @param oraclePxs - A list (sorted by key) of asset and oracle prices.
 * @param markPxs - An outer list of inner lists (inner list sorted by key) of asset and mark prices.
 * @param externalPerpPxs - A list (sorted by key) of asset and external prices which prevent sudden mark price deviations. 
                            Ideally externally determined by deployer, but could fall back to an EMA of recent mark prices. 
                            Must include all assets.
 */
type SetOracle {
  dex: string;
  oraclePxs: Array<[string, string]>;
  markPxs: Array<Array<[string, string]>>;
  externalPerpPxs: Array<[string, string]>;
}

type RegisterAssetRequest {
  coin: string;
  szDecimals: number;
  oraclePx: string;
  marginTableId: number;
  onlyIsolated: boolean;
}

/**
 * @param fullName - Full name of the perp dex
 * @param collateralToken - Collateral token index
 * @param oracleUpdater - User to update oracles. If not provided, then deployer is assumed to be oracle updater.
 */
type PerpDexSchemaInput {
  fullName: string;
  collateralToken: int;
  oracleUpdater?: string;
}

/**
 * A list (sorted by key) of asset and funding multiplier.
 * Multipliers must be between 0 and 10 and are used to scale the funding rate.
 */
type SetFundingMultipliers = Array<[string, string]>;

/**
 * A list (sorted by key) of asset and margin table ids.
 * Margin table ids must be non-zero.
 */
type SetMarginTableIds = Array<[string, number]>;

/**
 * Inserts margin table to dex
 */
type InsertMarginTable {
  dex: string;
  marginTable: RawMarginTable;
}

/**
 * marginTiers must be sorted in order of increasing lower bound and decreasing maxLeverage
 * marginTiers has a maximum length of 3.
 */
type RawMarginTable {
  description: string;
  marginTiers: Array<RawMarginTier>;
}

/**
 * lowerBound is a position notional value above which the leverage is constrained by maxLeverage
 */
type RawMarginTier {
  lowerBound: int;
  maxLeverage: MaxLeverage;
}

/**
 * Max leverage is in the range [1, 50]
 */
type MaxLeverage = number;

/**
 * A list (sorted by key) of asset and open interest cap notionals.
 * Open interest caps must be at least the maximum of 1_000_000 (1 usd) or half of the current open interest.
 */
type SetOpenInterestCaps = Array<[string, number]>;
```

See <https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/info-endpoint/perpetuals#retrieve-information-about-the-perp-deploy-auction> for how to query for the perp deploy auction status.
