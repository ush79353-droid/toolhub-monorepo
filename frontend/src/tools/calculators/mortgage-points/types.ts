import type { SupportedCurrency } from '@/tools/shared/currency';

/** Compounding conventions matching the reference (Omni-style UK/US vs Canada). */
export type CompoundingFrequency = 'monthly_uk_us' | 'semi_annual_canada';

export type TermUnit = 'yrs' | 'mos';

/** How points are paid: cash at closing, or financed into principal. */
export type PointsPaymentType = 'upfront' | 'rolled';

export const COMPOUNDING_FREQUENCY_OPTIONS: readonly {
  value: CompoundingFrequency;
  label: string;
}[] = [
  { value: 'monthly_uk_us', label: 'Monthly (UK & US)' },
  { value: 'semi_annual_canada', label: 'Semi-annually (Canada)' },
];

export const POINTS_PAYMENT_TYPE_OPTIONS: readonly {
  value: PointsPaymentType;
  label: string;
}[] = [
  { value: 'upfront', label: 'Upfront' },
  { value: 'rolled', label: 'Rolled into the loan' },
];

export interface MortgagePointsInput {
  loanAmount: string;
  loanCurrency: SupportedCurrency;
  mortgageTerm: string;
  termUnit: TermUnit;
  initialRatePercent: string;
  compounding: CompoundingFrequency;
  dueDate: string;
  /** When true: discount % per point + payment type controls are visible. */
  manualAdjust: boolean;
  /** Rate reduction gained per 1.0 mortgage point (percent points). Default 0.25. */
  discountPercentPerPoint: string;
  paymentType: PointsPaymentType;
  optionIPoints: string;
  optionICost: string;
  optionICostCurrency: SupportedCurrency;
  optionIRatePercent: string;
  optionIIPoints: string;
  optionIICost: string;
  optionIICostCurrency: SupportedCurrency;
  optionIIRatePercent: string;
}

export interface AnnualChartPoint {
  year: number;
  optIBalance: number;
  optIIBalance: number;
  optIInterest: number;
  optIIInterest: number;
}

export interface OptionSummary {
  label: 'Option I' | 'Option II';
  principal: number;
  monthlyPayment: number;
  monthlySavings: number;
  mortgageRatePercent: number;
  breakEvenMonths: number | null;
  totalInterest: number;
  /** Principal repaid + interest + upfront points (if not rolled). */
  totalPayments: number;
  pointsCost: number;
  points: number;
  formattedPrincipal: string;
  formattedMonthlyPayment: string;
  formattedMonthlySavings: string;
  formattedRate: string;
  formattedBreakEven: string;
  formattedTotalInterest: string;
  formattedTotalPayments: string;
}

export interface MortgagePointsResult {
  currency: SupportedCurrency;
  optionI: OptionSummary;
  optionII: OptionSummary;
  baselineMonthlyPayment: number;
  formattedBaselineMonthlyPayment: string;
  chart: AnnualChartPoint[];
}

export type MortgagePointsFieldErrors = {
  loanAmount?: string;
  mortgageTerm?: string;
  initialRatePercent?: string;
  dueDate?: string;
  discountPercentPerPoint?: string;
  optionIPoints?: string;
  optionICost?: string;
  optionIRatePercent?: string;
  optionIIPoints?: string;
  optionIICost?: string;
  optionIIRatePercent?: string;
  form?: string;
};

function todayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function createDefaultInput(): MortgagePointsInput {
  return {
    loanAmount: '250000',
    loanCurrency: 'PKR',
    mortgageTerm: '30',
    termUnit: 'yrs',
    initialRatePercent: '3.25',
    compounding: 'monthly_uk_us',
    dueDate: todayIsoDate(),
    manualAdjust: false,
    discountPercentPerPoint: '0.25',
    paymentType: 'upfront',
    optionIPoints: '1',
    optionICost: '2500',
    optionICostCurrency: 'PKR',
    optionIRatePercent: '3',
    optionIIPoints: '3',
    optionIICost: '7500',
    optionIICostCurrency: 'PKR',
    optionIIRatePercent: '2.5',
  };
}
