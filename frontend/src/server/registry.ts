const DEFAULT_SPLIT_ADDRESS = normalizeAddress(process.env.HYPERLIQUID_DEFAULT_SPLIT_ADDRESS);
const DEFAULT_MAX_FEE = process.env.HYPERLIQUID_DEFAULT_MAX_BUILDER_FEE
  ? Number(process.env.HYPERLIQUID_DEFAULT_MAX_BUILDER_FEE)
  : undefined;

if (DEFAULT_MAX_FEE !== undefined && !Number.isFinite(DEFAULT_MAX_FEE)) {
  throw new Error('HYPERLIQUID_DEFAULT_MAX_BUILDER_FEE must be a finite number');
}

export interface RegistryRecord {
  bundleHash: string;
  splitAddress: `0x${string}`;
  maxBuilderFee: number; // tenths of a basis point
}

const registry = new Map<string, RegistryRecord>();

if (DEFAULT_SPLIT_ADDRESS && DEFAULT_MAX_FEE !== undefined) {
  registry.set('DEFAULT', {
    bundleHash: 'DEFAULT',
    splitAddress: DEFAULT_SPLIT_ADDRESS,
    maxBuilderFee: DEFAULT_MAX_FEE,
  });
}

export async function lookupBundle(bundleHash: string): Promise<RegistryRecord | null> {
  const normalized = bundleHash.toLowerCase();
  const record = registry.get(normalized) ?? registry.get('DEFAULT');
  return record ?? null;
}

export function upsertMockBundle(record: RegistryRecord) {
  registry.set(record.bundleHash.toLowerCase(), {
    ...record,
    splitAddress: normalizeAddress(record.splitAddress)!,
  });
}

function normalizeAddress(address: string | undefined): `0x${string}` | undefined {
  if (!address) return undefined;
  return address.toLowerCase() as `0x${string}`;
}
