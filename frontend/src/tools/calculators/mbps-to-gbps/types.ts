export type DataRateUnit = 'Mbps' | 'Gbps' | 'GBps';

export interface RationalFactor {
  numerator: bigint;
  denominator: bigint;
}

export interface DataRateUnitDef {
  id: DataRateUnit;
  label: string;
  symbol: string;
  /** Exact factor relative to bits/s: bps = quantity × numerator / denominator. */
  factor: RationalFactor;
}

export type MbpsToGbpsFieldErrors = Partial<Record<DataRateUnit, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;

export const DATA_RATE_UNITS: readonly DataRateUnitDef[] = [
  {
    id: 'Mbps',
    label: 'Megabits per second',
    symbol: 'Mbps',
    factor: { numerator: 1_000_000n, denominator: 1n },
  },
  {
    id: 'Gbps',
    label: 'Gigabits per second',
    symbol: 'Gbps',
    factor: { numerator: 1_000_000_000n, denominator: 1n },
  },
  {
    id: 'GBps',
    label: 'Gigabytes per second',
    symbol: 'GB/s',
    // 1 GB/s = 1e9 bytes/s × 8 bits/byte = 8e9 bits/s
    factor: { numerator: 8_000_000_000n, denominator: 1n },
  },
];

export const DATA_RATE_UNIT_BY_ID: Readonly<Record<DataRateUnit, DataRateUnitDef>> =
  Object.freeze(
    Object.fromEntries(DATA_RATE_UNITS.map((u) => [u.id, u])) as Record<
      DataRateUnit,
      DataRateUnitDef
    >
  );

export const RATE_FIELDS: readonly DataRateUnit[] = ['Mbps', 'Gbps', 'GBps'];

export const DEFAULT_MBPS = '1000';
