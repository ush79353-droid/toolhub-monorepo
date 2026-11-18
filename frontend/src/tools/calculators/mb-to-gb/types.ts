export type NumberSystem = 'decimal' | 'binary';

export type DataUnit = 'MB' | 'GB';

export type MbToGbFieldErrors = Partial<Record<DataUnit, string>>;

export const MAX_INPUT_LENGTH = 64;
export const DISPLAY_FRAC_DIGITS = 18;

export const CONVERSION_FACTORS = {
  decimal: 1000n,
  binary: 1024n,
} as const;

export const NUMBER_SYSTEM_LABELS: Record<NumberSystem, string> = {
  decimal: 'Base-10 (SI decimal)',
  binary: 'Base-2 (legacy binary, 1024)',
};

export const DATA_UNITS: readonly DataUnit[] = ['MB', 'GB'];

export const DEFAULT_MB = '1000';
export const DEFAULT_SYSTEM: NumberSystem = 'decimal';
