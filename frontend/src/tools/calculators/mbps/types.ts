export type DataRateUnit =
  | 'bit/s'
  | 'kbit/s'
  | 'Mbit/s'
  | 'Gbit/s'
  | 'B/s'
  | 'kB/s'
  | 'MB/s'
  | 'GB/s';

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

export type MbpsFieldErrors = Partial<Record<DataRateUnit, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;

/** Bits-per-second multipliers for SI decimal rates (8 bits = 1 byte). */
export const DATA_RATE_UNITS: readonly DataRateUnitDef[] = [
  { id: 'bit/s', label: 'Bits per second', symbol: 'bit/s', factor: { numerator: 1n, denominator: 1n } },
  { id: 'kbit/s', label: 'Kilobits per second', symbol: 'kbit/s', factor: { numerator: 1_000n, denominator: 1n } },
  { id: 'Mbit/s', label: 'Megabits per second', symbol: 'Mbit/s', factor: { numerator: 1_000_000n, denominator: 1n } },
  { id: 'Gbit/s', label: 'Gigabits per second', symbol: 'Gbit/s', factor: { numerator: 1_000_000_000n, denominator: 1n } },
  { id: 'B/s', label: 'Bytes per second', symbol: 'B/s', factor: { numerator: 8n, denominator: 1n } },
  { id: 'kB/s', label: 'Kilobytes per second', symbol: 'kB/s', factor: { numerator: 8_000n, denominator: 1n } },
  { id: 'MB/s', label: 'Megabytes per second', symbol: 'MB/s', factor: { numerator: 8_000_000n, denominator: 1n } },
  { id: 'GB/s', label: 'Gigabytes per second', symbol: 'GB/s', factor: { numerator: 8_000_000_000n, denominator: 1n } },
];

export const DATA_RATE_UNIT_BY_ID: Readonly<Record<DataRateUnit, DataRateUnitDef>> =
  Object.freeze(
    Object.fromEntries(DATA_RATE_UNITS.map((u) => [u.id, u])) as Record<
      DataRateUnit,
      DataRateUnitDef
    >,
  );

export const PRIMARY_FIELDS: readonly DataRateUnit[] = ['Mbit/s', 'MB/s'];
export const BIT_FIELDS: readonly DataRateUnit[] = ['bit/s', 'kbit/s', 'Gbit/s'];
export const BYTE_FIELDS: readonly DataRateUnit[] = ['B/s', 'kB/s', 'GB/s'];
export const ALL_FIELDS: readonly DataRateUnit[] = [
  ...PRIMARY_FIELDS,
  ...BIT_FIELDS,
  ...BYTE_FIELDS,
];
