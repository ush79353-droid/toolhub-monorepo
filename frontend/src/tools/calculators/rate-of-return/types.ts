import type { SupportedCurrency } from '@/tools/shared/currency';

export type TermUnit = 'yrs' | 'mos';

export type CompoundFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly'
  | 'daily';

export type CashFlowFrequency =
  | 'annually'
  | 'semiannually'
  | 'quarterly'
  | 'monthly'
  | 'biweekly'
  | 'weekly';

export type PaymentTiming = 'end' | 'beginning';

export interface RateOfReturnInput {
  initialInvestment: string;
  finalAmount: string;
  term: string;
  termUnit: TermUnit;
  compounding: CompoundFrequency;
  periodicCashFlow: string;
  cashFlowFrequency: CashFlowFrequency;
  paymentTiming: PaymentTiming;
  currency: SupportedCurrency;
}

export interface RateOfReturnResult {
  initialInvestment: number;
  finalAmount: number;
  termYears: number;
  compounding: CompoundFrequency;
  compoundingPeriodsPerYear: number;
  periodicCashFlow: number;
  cashFlowFrequency: CashFlowFrequency;
  paymentTiming: PaymentTiming;
  annualRatePercent: number;
  currency: SupportedCurrency;
  formattedRate: string;
}

export type RateOfReturnFieldErrors = {
  initialInvestment?: string;
  finalAmount?: string;
  term?: string;
  periodicCashFlow?: string;
  form?: string;
};

export const COMPOUNDING_OPTIONS: readonly {
  value: CompoundFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
  { value: 'daily', label: 'Daily', periodsPerYear: 365 },
];

export const CASH_FLOW_FREQUENCY_OPTIONS: readonly {
  value: CashFlowFrequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'annually', label: 'Annually', periodsPerYear: 1 },
  { value: 'semiannually', label: 'Semiannually', periodsPerYear: 2 },
  { value: 'quarterly', label: 'Quarterly', periodsPerYear: 4 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
  { value: 'biweekly', label: 'Biweekly', periodsPerYear: 26 },
  { value: 'weekly', label: 'Weekly', periodsPerYear: 52 },
];

export const TERM_UNIT_OPTIONS: readonly { value: TermUnit; label: string }[] = [
  { value: 'yrs', label: 'yrs' },
  { value: 'mos', label: 'mos' },
];

export function createDefaultInput(): RateOfReturnInput {
  return {
    initialInvestment: '1000',
    finalAmount: '5000',
    term: '10',
    termUnit: 'yrs',
    compounding: 'monthly',
    periodicCashFlow: '0',
    cashFlowFrequency: 'monthly',
    paymentTiming: 'end',
    currency: 'PKR',
  };
}
