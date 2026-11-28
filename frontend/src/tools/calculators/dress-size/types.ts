/**
 * Dress Size Calculator — bust/waist/hips vs documented size chart.
 * Brands vary; chart is illustrative, not a universal standard.
 */

export type MeasurementUnit = 'cm' | 'in';

export type DressSizingSystem = 'US' | 'UK' | 'EU' | 'INT';

export type FitPreference = 'regular' | 'relaxed' | 'close';

export const UNIT_LABELS: Record<MeasurementUnit, string> = {
  cm: 'cm',
  in: 'in',
};

export const SYSTEM_LABELS: Record<DressSizingSystem, string> = {
  US: 'US',
  UK: 'UK',
  EU: 'Europe',
  INT: 'International',
};

export const FIT_LABELS: Record<FitPreference, string> = {
  regular: 'Regular fit',
  relaxed: 'Relaxed fit',
  close: 'Close fit',
};

export interface DressSizeChartEntry {
  usSize: string;
  ukSize: string;
  euSize: string;
  internationalSize: string;
  bustMinCm: number;
  bustMaxCm: number;
  waistMinCm: number;
  waistMaxCm: number;
  hipsMinCm: number;
  hipsMaxCm: number;
}

export interface DressSizeInput {
  bust: string;
  waist: string;
  hips: string;
  unit: MeasurementUnit;
  preferredSystem: DressSizingSystem;
  fitPreference: FitPreference;
  focusMeasure: 'bust' | 'waist' | 'hips' | null;
}

export interface DressSizeResult {
  bustCm: number;
  waistCm: number;
  hipsCm: number;
  recommended: DressSizeChartEntry | null;
  bustMatch: DressSizeChartEntry | null;
  waistMatch: DressSizeChartEntry | null;
  hipsMatch: DressSizeChartEntry | null;
  outOfRange: boolean;
  mixedSizes: boolean;
  fitGuidance: string;
  chartSource: string;
  formulaSteps: string[];
  explanation: string;
}

export type DressSizeFieldErrors = {
  bust?: string;
  waist?: string;
  hips?: string;
  form?: string;
};

export function createEmptyInput(): DressSizeInput {
  return {
    bust: '96',
    waist: '78',
    hips: '102',
    unit: 'cm',
    preferredSystem: 'US',
    fitPreference: 'regular',
    focusMeasure: null,
  };
}

export function createBlankInput(): DressSizeInput {
  return {
    ...createEmptyInput(),
    bust: '',
    waist: '',
    hips: '',
  };
}

export function labelForSystem(
  entry: DressSizeChartEntry,
  system: DressSizingSystem,
): string {
  if (system === 'UK') return `UK ${entry.ukSize}`;
  if (system === 'EU') return `EU ${entry.euSize}`;
  if (system === 'INT') return entry.internationalSize;
  return `US ${entry.usSize}`;
}
