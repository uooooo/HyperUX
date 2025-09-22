const REDSTONE_ENDPOINT = 'https://api.redstone.finance/prices';

export interface RedstonePrice {
  symbol: string;
  value: number;
  timestamp: number;
}

export async function fetchRedstonePrice(symbol: string): Promise<RedstonePrice | null> {
  try {
    const url = `${REDSTONE_ENDPOINT}?symbols=${encodeURIComponent(symbol)}`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Redstone price request failed', response.status, response.statusText);
      return null;
    }

    const payload = await response.json();
    const entry = payload?.[symbol];
    if (!entry || typeof entry.value !== 'number') return null;

    return {
      symbol,
      value: entry.value,
      timestamp: entry.timestamp ?? Date.now(),
    };
  } catch (error) {
    console.error('Failed to fetch Redstone price', error);
    return null;
  }
}
