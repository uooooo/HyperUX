export function normalizePerpMarketSymbol(raw: string) {
  const upper = raw.toUpperCase();
  if (upper.endsWith('-PERP')) {
    return upper.replace('-PERP', '');
  }
  if (upper.endsWith('USDT')) {
    return upper.slice(0, -4);
  }
  return upper;
}
