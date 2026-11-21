import type { UsStateCode } from '../mega-millions-payout/types';

export type FilingStatus =
  | 'single'
  | 'married_jointly'
  | 'married_separately'
  | 'head_of_household';

export type { UsStateCode };

export interface PowerballInput {
  jackpot: string;
  lumpSumPercent: string;
  filingStatus: FilingStatus;
  state: UsStateCode | '';
}

export interface PayoutTaxBreakdown {
  grossPayout: number;
  federalWithholding: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  netPayout: number;
}

export interface AnnuityPaymentRow {
  year: number;
  grossPayment: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  netPayment: number;
}

export interface PowerballResult {
  taxYear: number;
  advertisedJackpot: number;
  lumpSumPercent: number;
  filingStatus: FilingStatus;
  state: UsStateCode;
  stateName: string;
  annuityGrowthPercent: number;
  lumpSum: PayoutTaxBreakdown;
  annuity: PayoutTaxBreakdown;
  annuityFirstPayment: number;
  annuityLastPayment: number;
  annualPayments: AnnuityPaymentRow[];
  futureTaxAssumptionNote: string;
  summaryText: string;
}

export type PowerballFieldErrors = {
  jackpot?: string;
  lumpSumPercent?: string;
  filingStatus?: string;
  state?: string;
  form?: string;
};

export const FILING_STATUS_OPTIONS: readonly {
  value: FilingStatus;
  label: string;
}[] = [
  { value: 'single', label: 'Single' },
  { value: 'married_jointly', label: 'Married Filing Jointly' },
  { value: 'married_separately', label: 'Married Filing Separately' },
  { value: 'head_of_household', label: 'Head of Household' },
] as const;

export const POWERBALL_ANNUITY_GROWTH = 0.05;
export const POWERBALL_PAYMENT_COUNT = 30;
/** Common federal lottery withholding rate on reportable winnings (not final tax). */
export const FEDERAL_LOTTERY_WITHHOLDING_RATE = 0.24;

export function createDefaultInput(): PowerballInput {
  return {
    jackpot: '281,000,000',
    lumpSumPercent: '52',
    filingStatus: 'single',
    state: 'AL',
  };
}

export function createBlankInput(): PowerballInput {
  return {
    jackpot: '',
    lumpSumPercent: '',
    filingStatus: 'single',
    state: '',
  };
}
