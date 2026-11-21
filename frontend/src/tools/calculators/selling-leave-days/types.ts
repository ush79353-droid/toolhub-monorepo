import type { SupportedCurrency } from '@/tools/shared/currency';

export type SalaryFrequency = 'annual' | 'monthly' | 'weekly' | 'hourly';

export interface SellingLeaveDaysInput {
  frequency: SalaryFrequency;
  basePay: string;
  basePayCurrency: SupportedCurrency;
  leaveDays: string;
  resultCurrency: SupportedCurrency;
}

export interface SellingLeaveDaysResult {
  dailyPayCanonical: number;
  payoutCanonical: number;
  payout: number;
  basePayCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
  frequency: SalaryFrequency;
  formattedPayout: string;
  workingDaysPerYear: number;
}

export type SellingLeaveDaysFieldErrors = {
  basePay?: string;
  leaveDays?: string;
  form?: string;
};

export function createDefaultInput(): SellingLeaveDaysInput {
  return {
    frequency: 'monthly',
    basePay: '',
    basePayCurrency: 'PKR',
    leaveDays: '',
    resultCurrency: 'PKR',
  };
}

export function basePayLabel(frequency: SalaryFrequency): string {
  if (frequency === 'annual') return 'Base pay per year';
  if (frequency === 'monthly') return 'Base pay per month';
  if (frequency === 'weekly') return 'Base pay per week';
  return 'Base pay per hour';
}
