import type { SupportedCurrency } from '@/tools/shared/currency';

export type GdpGrowthMode = 'growth' | 'current' | 'previous';

export type GdpMagnitude =
  | 'units'
  | 'thousands'
  | 'millions'
  | 'billions'
  | 'trillions';

export type GdpPeriod = 'annual' | 'quarterly' | 'custom';

export type GdpMeasureType = 'real' | 'nominal' | 'unspecified';

export const GDP_MAGNITUDE_OPTIONS: readonly {
  id: GdpMagnitude;
  label: string;
  factor: number;
}[] = [
  { id: 'units', label: 'Units', factor: 1 },
  { id: 'thousands', label: 'Thousands', factor: 1_000 },
  { id: 'millions', label: 'Millions', factor: 1_000_000 },
  { id: 'billions', label: 'Billions', factor: 1_000_000_000 },
  { id: 'trillions', label: 'Trillions', factor: 1_000_000_000_000 },
] as const;

export interface GdpGrowthInput {
  mode: GdpGrowthMode;
  currency: SupportedCurrency;
  currentGdp: string;
  currentMagnitude: GdpMagnitude;
  previousGdp: string;
  previousMagnitude: GdpMagnitude;
  growthPercent: string;
  period: GdpPeriod;
  measureType: GdpMeasureType;
  /** Only meaningful for consecutive quarterly levels; labeled separately. */
  annualizeQuarterly: boolean;
}

export interface GdpGrowthResult {
  mode: GdpGrowthMode;
  currency: SupportedCurrency;
  currentBase: number;
  previousBase: number;
  growthPercent: number;
  absoluteChange: number;
  annualizedGrowth: number | null;
  formattedCurrent: string;
  formattedPrevious: string;
  formattedGrowth: string;
  formattedAbsoluteChange: string;
  formattedAnnualized: string | null;
  displayCurrent: string;
  displayPrevious: string;
  displayGrowth: string;
  periodLabel: string;
  measureLabel: string;
  statusTitle: string;
  interpretation: string;
  formulaBreakdown: string;
  steps: string[];
  explanation: string;
}

export type GdpGrowthFieldErrors = {
  form?: string;
  currentGdp?: string;
  previousGdp?: string;
  growthPercent?: string;
};

export function createDefaultInput(): GdpGrowthInput {
  return {
    mode: 'growth',
    currency: 'PKR',
    currentGdp: '',
    currentMagnitude: 'trillions',
    previousGdp: '',
    previousMagnitude: 'trillions',
    growthPercent: '',
    period: 'annual',
    measureType: 'real',
    annualizeQuarterly: false,
  };
}

export function createEmptyInput(
  mode: GdpGrowthMode = 'growth'
): GdpGrowthInput {
  return { ...createDefaultInput(), mode };
}

export function createExampleInput(): GdpGrowthInput {
  return {
    mode: 'growth',
    currency: 'USD',
    currentGdp: '21',
    currentMagnitude: 'trillions',
    previousGdp: '20',
    previousMagnitude: 'trillions',
    growthPercent: '',
    period: 'annual',
    measureType: 'real',
    annualizeQuarterly: false,
  };
}
