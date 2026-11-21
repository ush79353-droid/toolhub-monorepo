import type { SupportedCurrency } from '@/tools/shared/currency';

export interface BillRateInput {
  /** Employee annual salary (money). */
  annualSalary: string;
  annualSalaryCurrency: SupportedCurrency;
  /** Annual billable capacity in hours/year (default 2,080). Never FX-converted. */
  capacity: string;
  /** Pricing uplift multiplier (default 4). Never FX-converted. */
  multiplier: string;
  /** Independent display currency for bill rate (/hr). */
  billRateCurrency: SupportedCurrency;
}

export interface BillRateResult {
  /** Full-precision bill rate in annual-salary currency. */
  billRateCanonical: number;
  /** Full-precision bill rate in display currency. */
  billRate: number;
  annualSalaryCurrency: SupportedCurrency;
  billRateCurrency: SupportedCurrency;
  formattedBillRate: string;
  capacity: number;
  multiplier: number;
}

export type BillRateFieldErrors = {
  annualSalary?: string;
  capacity?: string;
  multiplier?: string;
  form?: string;
};

export function createDefaultInput(): BillRateInput {
  return {
    annualSalary: '',
    annualSalaryCurrency: 'PKR',
    capacity: '2,080',
    multiplier: '4',
    billRateCurrency: 'PKR',
  };
}
