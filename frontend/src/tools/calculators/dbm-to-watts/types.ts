export const CONVERSION_MODES = [
  'dbmToWatts',
  'dbmToMilliwatts',
  'wattsToDbm',
  'milliwattsToDbm',
] as const;

export type ConversionMode = (typeof CONVERSION_MODES)[number];

export const DEFAULT_MODE: ConversionMode = 'dbmToWatts';

export const MODE_LABELS: Record<ConversionMode, string> = {
  dbmToWatts: 'dBm to watts',
  dbmToMilliwatts: 'dBm to milliwatts',
  wattsToDbm: 'Watts to dBm',
  milliwattsToDbm: 'Milliwatts to dBm',
};

export interface ModeFieldMeta {
  inputLabel: string;
  inputUnit: string;
  outputLabel: string;
  outputUnit: string;
  formulaShare: string;
  /** When true, input may be negative (dBm). When false, input must be > 0. */
  allowNegativeInput: boolean;
  requirePositiveInput: boolean;
}

export const MODE_META: Record<ConversionMode, ModeFieldMeta> = {
  dbmToWatts: {
    inputLabel: 'Power in decibel milliwatts (dBm)',
    inputUnit: 'dBm',
    outputLabel: 'Power in watts (W)',
    outputUnit: 'W',
    formulaShare: 'W = 10^((dBm - 30) / 10)',
    allowNegativeInput: true,
    requirePositiveInput: false,
  },
  dbmToMilliwatts: {
    inputLabel: 'Power in decibel milliwatts (dBm)',
    inputUnit: 'dBm',
    outputLabel: 'Power in milliwatts (mW)',
    outputUnit: 'mW',
    formulaShare: 'mW = 10^(dBm / 10)',
    allowNegativeInput: true,
    requirePositiveInput: false,
  },
  wattsToDbm: {
    inputLabel: 'Power in watts (W)',
    inputUnit: 'W',
    outputLabel: 'Power in decibel milliwatts (dBm)',
    outputUnit: 'dBm',
    formulaShare: 'dBm = 10 × log10(W) + 30',
    allowNegativeInput: false,
    requirePositiveInput: true,
  },
  milliwattsToDbm: {
    inputLabel: 'Power in milliwatts (mW)',
    inputUnit: 'mW',
    outputLabel: 'Power in decibel milliwatts (dBm)',
    outputUnit: 'dBm',
    formulaShare: 'dBm = 10 × log10(mW)',
    allowNegativeInput: false,
    requirePositiveInput: true,
  },
};

export type DbmField = 'input' | 'output';
export type DbmFieldErrors = Partial<Record<'input', string>>;

export const MAX_ABS_DBM = 300;
export const MAX_ABS_LINEAR = 1e24;
