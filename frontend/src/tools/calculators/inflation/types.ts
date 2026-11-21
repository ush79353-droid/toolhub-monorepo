import { US_CPI_MAX_YEAR } from '../buying-power/us-cpi-u-annual';

export type InflationDataMode = 'historical' | 'custom';
export type InflationFrequency = 'yearly' | 'quarterly';
export type CustomTimeUnit = 'years' | 'months' | 'quarters';

export interface InflationInput {
  dataMode: InflationDataMode;
  frequency: InflationFrequency;
  originalAmount: string;
  referenceYear: string;
  referenceQuarter: string;
  targetYear: string;
  targetQuarter: string;
  annualInflationRate: string;
  timePeriod: string;
  timeUnit: CustomTimeUnit;
}

export interface InflationResult {
  dataMode: InflationDataMode;
  originalAmount: number;
  adjustedAmount: number;
  cumulativeInflationPercent: number;
  annualizedInflationPercent: number | null;
  purchasingPowerFactor: number;
  monetaryChange: number;
  referenceLabel: string;
  targetLabel: string;
  referenceCPI: number | null;
  targetCPI: number | null;
  yearsElapsed: number | null;
  annualRatePercent: number | null;
  formattedOriginal: string;
  formattedAdjusted: string;
  formattedCumulative: string;
  formattedAnnualized: string;
  formattedPurchasingPowerFactor: string;
  formattedMonetaryChange: string;
  interpretation: string;
  explanation: string;
  formulaBreakdown: string;
  steps: string[];
  sourceSummary: string;
  chart: InflationChartData;
}

export type InflationChartData =
  | {
      kind: 'historical-cpi';
      points: { year: number; cpi: number }[];
      referenceYear: number;
      targetYear: number;
      note: string;
    }
  | {
      kind: 'custom-projection';
      points: { yearFraction: number; amount: number; purchasingPower: number }[];
      note: string;
    };

export type InflationFieldErrors = {
  form?: string;
  originalAmount?: string;
  referenceYear?: string;
  referenceQuarter?: string;
  targetYear?: string;
  targetQuarter?: string;
  annualInflationRate?: string;
  timePeriod?: string;
  frequency?: string;
};

export function createDefaultInput(): InflationInput {
  return {
    dataMode: 'historical',
    frequency: 'yearly',
    originalAmount: '100',
    referenceYear: '2010',
    referenceQuarter: '1',
    targetYear: String(US_CPI_MAX_YEAR),
    targetQuarter: '1',
    annualInflationRate: '3',
    timePeriod: '5',
    timeUnit: 'years',
  };
}

export function createEmptyInput(
  dataMode: InflationDataMode = 'historical'
): InflationInput {
  return {
    ...createDefaultInput(),
    dataMode,
    originalAmount: '',
    referenceYear: '',
    targetYear: '',
    annualInflationRate: '',
    timePeriod: '',
  };
}

/** Historical example using real BLS annual averages when available. */
export function createHistoricalExampleInput(): InflationInput {
  return {
    ...createDefaultInput(),
    dataMode: 'historical',
    frequency: 'yearly',
    originalAmount: '1000',
    referenceYear: '2000',
    targetYear: '2020',
  };
}

export function createCustomExampleInput(): InflationInput {
  return {
    ...createDefaultInput(),
    dataMode: 'custom',
    originalAmount: '1000',
    annualInflationRate: '3',
    timePeriod: '5',
    timeUnit: 'years',
  };
}
