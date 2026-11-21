import type { SupportedCurrency } from '@/tools/shared/currency';

export type CareCostFrequency = 'daily' | 'monthly';

export interface LongTermCareInput {
  frequency: CareCostFrequency;
  careCost: string;
  /** Annual baseline used for inflation series (auto from care cost; editable override). */
  presentYearCost: string;
  presentYearManuallySet: boolean;
  years: string;
  inflationRate: string;
  currency: SupportedCurrency;
}

export interface AnnualCareProjection {
  year: number;
  annualCost: number;
  cumulativeCost: number;
}

export interface LongTermCareResult {
  frequency: CareCostFrequency;
  careCost: number;
  annualCareCost: number;
  inflationRatePercent: number;
  projectionYears: number;
  finalYearCost: number;
  totalEstimatedCost: number;
  currency: SupportedCurrency;
  projection: AnnualCareProjection[];
  summaryText: string;
}

export type LongTermCareFieldErrors = {
  careCost?: string;
  presentYearCost?: string;
  years?: string;
  inflationRate?: string;
  form?: string;
};

export function createDefaultInput(): LongTermCareInput {
  return {
    frequency: 'daily',
    careCost: '250',
    presentYearCost: '91250',
    presentYearManuallySet: false,
    years: '5',
    inflationRate: '4',
    currency: 'USD',
  };
}

export function createBlankInput(
  currency: SupportedCurrency = 'USD',
): LongTermCareInput {
  return {
    frequency: 'daily',
    careCost: '',
    presentYearCost: '',
    presentYearManuallySet: false,
    years: '',
    inflationRate: '',
    currency,
  };
}
