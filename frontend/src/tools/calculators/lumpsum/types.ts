import type { SupportedCurrency } from '@/tools/shared/currency';

export type CompoundingFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'weekly'
  | 'daily'
  | 'continuously';

export type LumpsumCalculationMode =
  | 'initial-lumpsum'
  | 'final-balance'
  | 'expected-return'
  | 'investment-term';

export type TermUnit = 'years' | 'months';

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
  periodsPerYear: number | null;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
  { value: 'continuously', label: 'Continuously', periodsPerYear: null },
] as const;

export const MODE_OPTIONS: readonly {
  value: LumpsumCalculationMode;
  label: string;
}[] = [
  { value: 'initial-lumpsum', label: 'Initial lumpsum' },
  { value: 'final-balance', label: 'Final balance' },
  { value: 'expected-return', label: 'Expected rate of return' },
  { value: 'investment-term', label: 'Investment term' },
] as const;

export interface LumpsumInput {
  currency: SupportedCurrency;
  mode: LumpsumCalculationMode;
  /** Used when mode is final-balance, expected-return, or investment-term */
  initialInvestment: string;
  /** Goal / FV — used when mode is initial-lumpsum, expected-return, or investment-term */
  targetAmount: string;
  /** Nominal annual % — used when mode is initial-lumpsum, final-balance, or investment-term */
  annualReturn: string;
  /** Term value — used when mode is initial-lumpsum, final-balance, or expected-return */
  termValue: string;
  termUnit: TermUnit;
  startDate: string;
  inflationRate: string;
  compoundingFrequency: CompoundingFrequency;
}

export interface LumpsumScheduleRow {
  year: number;
  openingBalance: number;
  returns: number;
  closingBalance: number;
  inflationAdjustedBalance: number;
}

export interface LumpsumResult {
  currency: SupportedCurrency;
  mode: LumpsumCalculationMode;
  initialInvestment: number;
  finalBalance: number;
  totalReturns: number;
  investmentTermYears: number;
  investmentTermMonths: number;
  nominalAnnualReturn: number;
  effectiveAnnualReturn: number;
  inflationRate: number;
  inflationAdjustedBalance: number;
  inflationImpact: number;
  realGain: number;
  compoundingFrequency: CompoundingFrequency;
  startDate: string;
  endDate: string;
  schedule: LumpsumScheduleRow[];
  primaryLabel: string;
  primaryValue: number;
  formattedPrimary: string;
  formattedFinalBalance: string;
  formattedInitial: string;
  formattedReturns: string;
  formattedRealBalance: string;
  steps: string[];
  formulaBreakdown: string;
  interpretation: string;
  explanation: string;
}

export type LumpsumFieldErrors = {
  form?: string;
  initialInvestment?: string;
  targetAmount?: string;
  annualReturn?: string;
  termValue?: string;
  startDate?: string;
  inflationRate?: string;
};

function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function createDefaultInput(): LumpsumInput {
  return {
    currency: 'INR',
    mode: 'initial-lumpsum',
    initialInvestment: '',
    targetAmount: '',
    annualReturn: '10',
    termValue: '10',
    termUnit: 'years',
    startDate: todayIso(),
    inflationRate: '0',
    compoundingFrequency: 'monthly',
  };
}

export function createEmptyInput(): LumpsumInput {
  return {
    currency: 'INR',
    mode: 'initial-lumpsum',
    initialInvestment: '',
    targetAmount: '',
    annualReturn: '',
    termValue: '',
    termUnit: 'years',
    startDate: todayIso(),
    inflationRate: '',
    compoundingFrequency: 'monthly',
  };
}

/** Reference: goal ₹100,000 · 10% · 10y · monthly → PV ≈ ₹36,940.70 */
export function createExampleInput(): LumpsumInput {
  return {
    currency: 'INR',
    mode: 'initial-lumpsum',
    initialInvestment: '',
    targetAmount: '100000',
    annualReturn: '10',
    termValue: '10',
    termUnit: 'years',
    startDate: todayIso(),
    inflationRate: '6',
    compoundingFrequency: 'monthly',
  };
}
