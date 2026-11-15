export type StorageUnit =
  | 'bit'
  | 'nibble'
  | 'B'
  | 'KB'
  | 'MB'
  | 'GB'
  | 'TB'
  | 'PB'
  | 'EB'
  | 'KiB'
  | 'MiB'
  | 'GiB'
  | 'TiB'
  | 'PiB'
  | 'EiB';

export type StorageCategory = 'bit-nibble' | 'decimal' | 'binary';

export type PrimaryField = 'B' | 'KB' | 'MB' | 'GB';

export type SourceField = PrimaryField | 'extra';

export interface RationalFactor {
  numerator: bigint;
  denominator: bigint;
}

export interface StorageUnitDef {
  id: StorageUnit;
  label: string;
  symbol: string;
  category: StorageCategory;
  /** Exact factor relative to bytes: value_in_bytes = quantity × numerator / denominator. */
  factor: RationalFactor;
}

export type ByteConversionFieldErrors = Partial<Record<SourceField, string>>;

export const MAX_INPUT_LENGTH = 64;
/** Display fraction digits for formatted outputs (exact math may keep more). */
export const DISPLAY_FRAC_DIGITS = 18;

export const STORAGE_UNITS: readonly StorageUnitDef[] = [
  {
    id: 'bit',
    label: 'Bits',
    symbol: 'bit',
    category: 'bit-nibble',
    factor: { numerator: 1n, denominator: 8n },
  },
  {
    id: 'nibble',
    label: 'Nibbles',
    symbol: 'nibble',
    category: 'bit-nibble',
    factor: { numerator: 1n, denominator: 2n },
  },
  {
    id: 'B',
    label: 'Bytes',
    symbol: 'B',
    category: 'decimal',
    factor: { numerator: 1n, denominator: 1n },
  },
  {
    id: 'KB',
    label: 'Kilobytes (decimal)',
    symbol: 'KB',
    category: 'decimal',
    factor: { numerator: 1000n, denominator: 1n },
  },
  {
    id: 'MB',
    label: 'Megabytes (decimal)',
    symbol: 'MB',
    category: 'decimal',
    factor: { numerator: 1_000_000n, denominator: 1n },
  },
  {
    id: 'GB',
    label: 'Gigabytes (decimal)',
    symbol: 'GB',
    category: 'decimal',
    factor: { numerator: 1_000_000_000n, denominator: 1n },
  },
  {
    id: 'TB',
    label: 'Terabytes (decimal)',
    symbol: 'TB',
    category: 'decimal',
    factor: { numerator: 1_000_000_000_000n, denominator: 1n },
  },
  {
    id: 'PB',
    label: 'Petabytes (decimal)',
    symbol: 'PB',
    category: 'decimal',
    factor: { numerator: 1_000_000_000_000_000n, denominator: 1n },
  },
  {
    id: 'EB',
    label: 'Exabytes (decimal)',
    symbol: 'EB',
    category: 'decimal',
    factor: { numerator: 1_000_000_000_000_000_000n, denominator: 1n },
  },
  {
    id: 'KiB',
    label: 'Kibibytes (binary)',
    symbol: 'KiB',
    category: 'binary',
    factor: { numerator: 1024n, denominator: 1n },
  },
  {
    id: 'MiB',
    label: 'Mebibytes (binary)',
    symbol: 'MiB',
    category: 'binary',
    factor: { numerator: 1_048_576n, denominator: 1n },
  },
  {
    id: 'GiB',
    label: 'Gibibytes (binary)',
    symbol: 'GiB',
    category: 'binary',
    factor: { numerator: 1_073_741_824n, denominator: 1n },
  },
  {
    id: 'TiB',
    label: 'Tebibytes (binary)',
    symbol: 'TiB',
    category: 'binary',
    factor: { numerator: 1_099_511_627_776n, denominator: 1n },
  },
  {
    id: 'PiB',
    label: 'Pebibytes (binary)',
    symbol: 'PiB',
    category: 'binary',
    factor: { numerator: 1_125_899_906_842_624n, denominator: 1n },
  },
  {
    id: 'EiB',
    label: 'Exbibytes (binary)',
    symbol: 'EiB',
    category: 'binary',
    factor: { numerator: 1_152_921_504_606_846_976n, denominator: 1n },
  },
];

export const STORAGE_UNIT_BY_ID: Readonly<Record<StorageUnit, StorageUnitDef>> =
  Object.freeze(
    Object.fromEntries(STORAGE_UNITS.map((u) => [u.id, u])) as Record<
      StorageUnit,
      StorageUnitDef
    >
  );

export const PRIMARY_FIELDS: readonly PrimaryField[] = ['B', 'KB', 'MB', 'GB'];

export const EXTRA_UNITS: readonly StorageUnit[] = [
  'bit',
  'nibble',
  'TB',
  'PB',
  'EB',
  'KiB',
  'MiB',
  'GiB',
  'TiB',
  'PiB',
  'EiB',
];

export const DEFAULT_EXTRA_UNIT: StorageUnit = 'KiB';
export const DEFAULT_BYTES = '1000';
