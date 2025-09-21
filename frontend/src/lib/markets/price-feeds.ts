import { env } from '@/lib/config/env';
import { fetchAllMids } from '@/lib/hyperliquid/service';

type VenueRow = {
  venue: string;
  market: string;
  price: number;
  change24hPct?: number;
};

export type PriceFeedVenue = 'hyperliquid' | 'binance' | 'upbit';

export interface PriceFeedRequest {
  venue: PriceFeedVenue;
  /** Market identifier: e.g. `BTC`, `BTCUSDT`, `KRW-BTC`. */
  market: string;
  /** Optional label override for display. */
  label?: string;
}

interface ExternalTickerResponse {
  price: number;
  change24hPct?: number;
}

async function fetchBinanceTicker(symbol: string): Promise<ExternalTickerResponse | null> {
  try {
    const response = await fetch(
      `${env.binance.restUrl}/api/v3/ticker/24hr?symbol=${encodeURIComponent(symbol)}`,
      {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    return {
      price: Number(payload.lastPrice ?? payload.weightedAvgPrice ?? '0'),
      change24hPct: Number(payload.priceChangePercent ?? '0'),
    };
  } catch (error) {
    console.error('Failed to fetch Binance ticker', error);
    return null;
  }
}

async function fetchUpbitTicker(market: string): Promise<ExternalTickerResponse | null> {
  try {
    const response = await fetch(
      `${env.upbit.restUrl}/v1/ticker?markets=${encodeURIComponent(market)}`,
      {
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    const first = Array.isArray(payload) ? payload[0] : null;
    if (!first) return null;
    const price = Number(first.trade_price ?? first.prev_closing_price ?? '0');
    const change = typeof first.signed_change_rate === 'number' ? first.signed_change_rate * 100 : undefined;
    return { price, change24hPct: change };
  } catch (error) {
    console.error('Failed to fetch Upbit ticker', error);
    return null;
  }
}

async function fetchHyperliquidTicker(market: string, midsCache?: Awaited<ReturnType<typeof fetchAllMids>>) {
  const mids = midsCache ?? (await fetchAllMids());
  const value = mids[market];
  if (!value) return null;
  return {
    price: Number(value),
    change24hPct: undefined,
  } satisfies ExternalTickerResponse;
}

export async function fetchPriceTickerRows(requests: PriceFeedRequest[]): Promise<VenueRow[]> {
  if (requests.length === 0) return [];

  const hyperliquidRequests = requests.filter((request) => request.venue === 'hyperliquid');
  const nonHyperRequests = requests.filter((request) => request.venue !== 'hyperliquid');

  let midsCache: Awaited<ReturnType<typeof fetchAllMids>> | undefined;
  if (hyperliquidRequests.length > 0) {
    midsCache = await fetchAllMids();
  }

  const results: VenueRow[] = [];

  for (const request of hyperliquidRequests) {
    const ticker = await fetchHyperliquidTicker(request.market, midsCache);
    if (!ticker) continue;
    results.push({
      venue: request.label ?? 'Hyperliquid',
      market: request.market,
      price: ticker.price,
      change24hPct: ticker.change24hPct,
    });
  }

  for (const request of nonHyperRequests) {
    let ticker: ExternalTickerResponse | null = null;
    if (request.venue === 'binance') {
      ticker = await fetchBinanceTicker(request.market);
    } else if (request.venue === 'upbit') {
      ticker = await fetchUpbitTicker(request.market);
    }
    if (!ticker) continue;
    results.push({
      venue: request.label ?? request.venue.charAt(0).toUpperCase() + request.venue.slice(1),
      market: request.market,
      price: ticker.price,
      change24hPct: ticker.change24hPct,
    });
  }

  return results;
}
