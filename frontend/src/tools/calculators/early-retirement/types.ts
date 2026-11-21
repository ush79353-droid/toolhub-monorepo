import type { SupportedCurrency } from '@/tools/shared/currency';

export type DurationDisplayUnit = 'years' | 'months';

export interface EarlyRetirementInput {
  netIncome: string;
  expenses: string;
  initialBalance: string;
  returnOnInvestment: string;
  withdrawalRate: string;
  durationUnit: DurationDisplayUnit;
  currency: SupportedCurrency;
}

export interface EarlyRetirementResult {
  netIncome: number;
  expenses: number;
  initialBalance: number;
  monthlyDeposit: number;
  annualReturnPercent: number;
  withdrawalRatePercent: number;
  requiredBalance: number;
  totalContribution: number;
  totalInterest: number;
  /** Exact months to target before ceiling (for display). */
  monthsExact: number;
  /** Whole months of end-of-month deposits used for contribution totals. */
  monthsWhole: number;
  yearsPart: number;
  monthsPart: number;
  durationYears: number;
  durationMonths: number;
  alreadyIndependent: boolean;
  unreachable: boolean;
  statusMessage: string | null;
  currency: SupportedCurrency;
  formattedMonthlyDeposit: string;
  formattedRequiredBalance: string;
  formattedTotalContribution: string;
  formattedTotalInterest: string;
  formattedDuration: string;
  contributionTimingNote: string;
}

export type EarlyRetirementFieldErrors = {
  form?: string;
  netIncome?: string;
  expenses?: string;
  initialBalance?: string;
  returnOnInvestment?: string;
  withdrawalRate?: string;
};

/** Screenshot defaults: initial 0, ROI 5%/yr, withdrawal 4%. Example income/expenses. */
export function createDefaultInput(): EarlyRetirementInput {
  return {
    netIncome: '60000',
    expenses: '30000',
    initialBalance: '0',
    returnOnInvestment: '5',
    withdrawalRate: '4',
    durationUnit: 'months',
    currency: 'PKR',
  };
}

export function createEmptyInput(
  currency: SupportedCurrency = 'PKR'
): EarlyRetirementInput {
  return {
    netIncome: '',
    expenses: '',
    initialBalance: '',
    returnOnInvestment: '',
    withdrawalRate: '',
    durationUnit: 'months',
    currency,
  };
}
