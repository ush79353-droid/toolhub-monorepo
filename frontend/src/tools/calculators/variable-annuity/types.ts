import type { SupportedCurrency } from '@/tools/shared/currency';

export type KnowTarget = 'finalBalance';
export type AnnuityType = 'due' | 'ordinary';
/** Frequencies confirmed by the reference (payment Monthly, compounding Yearly). */
export type Frequency = 'yearly' | 'monthly';
export type TaxMethod = 'usFederal';
export type FilingStatus = 'single';

export const KNOW_TARGET_OPTIONS: readonly {
  value: KnowTarget;
  label: string;
}[] = [
  { value: 'finalBalance', label: 'What will be my final balance?' },
] as const;

export const FREQUENCY_OPTIONS: readonly {
  value: Frequency;
  label: string;
  periodsPerYear: number;
}[] = [
  { value: 'yearly', label: 'Yearly', periodsPerYear: 1 },
  { value: 'monthly', label: 'Monthly', periodsPerYear: 12 },
] as const;

export const ANNUITY_TYPE_OPTIONS: readonly {
  value: AnnuityType;
  label: string;
}[] = [
  { value: 'due', label: 'Annuity due' },
  { value: 'ordinary', label: 'Ordinary annuity' },
] as const;

export const TAX_METHOD_OPTIONS: readonly {
  value: TaxMethod;
  label: string;
}[] = [{ value: 'usFederal', label: 'US Federal Income Tax' }] as const;

export const FILING_STATUS_OPTIONS: readonly {
  value: FilingStatus;
  label: string;
}[] = [{ value: 'single', label: 'Single' }] as const;

export interface VariableAnnuityInput {
  knowTarget: KnowTarget;
  startingBalance: string;
  startingBalanceCurrency: SupportedCurrency;
  currentAge: string;
  withdrawalAge: string;
  lengthYears: string;
  contribution: string;
  contributionCurrency: SupportedCurrency;
  paymentFrequency: Frequency;
  annuityType: AnnuityType;
  rateOfReturnPercent: string;
  compoundingFrequency: Frequency;
  annualGrowthPercent: string;
  taxMethod: TaxMethod;
  filingStatus: FilingStatus;
  annualIncome: string;
  annualIncomeCurrency: SupportedCurrency;
  incomeGrowthPercent: string;
  inflationPercent: string;
}

export interface VariableAnnuityResult {
  openingBalance: number;
  finalBalanceBeforeTax: number;
  finalBalanceTaxable: number | null;
  taxableAvailable: boolean;
  taxableNote: string | null;
  totalReturn: number;
  numberOfContributions: number;
  annualContribution: number;
  totalContribution: number;
  lengthYears: number;
  currency: SupportedCurrency;
  formattedOpeningBalance: string;
  formattedFinalBalanceBeforeTax: string;
  formattedFinalBalanceTaxable: string;
  formattedTotalReturn: string;
  formattedAnnualContribution: string;
  formattedTotalContribution: string;
  summaryText: string;
}

export type VariableAnnuityFieldErrors = {
  startingBalance?: string;
  currentAge?: string;
  withdrawalAge?: string;
  lengthYears?: string;
  contribution?: string;
  rateOfReturnPercent?: string;
  annualGrowthPercent?: string;
  annualIncome?: string;
  incomeGrowthPercent?: string;
  inflationPercent?: string;
  form?: string;
};

export function createDefaultInput(): VariableAnnuityInput {
  return {
    knowTarget: 'finalBalance',
    startingBalance: '10000',
    startingBalanceCurrency: 'PKR',
    currentAge: '25',
    withdrawalAge: '60',
    lengthYears: '35',
    contribution: '100',
    contributionCurrency: 'PKR',
    paymentFrequency: 'monthly',
    annuityType: 'due',
    rateOfReturnPercent: '12',
    compoundingFrequency: 'yearly',
    annualGrowthPercent: '0',
    taxMethod: 'usFederal',
    filingStatus: 'single',
    annualIncome: '0',
    annualIncomeCurrency: 'PKR',
    incomeGrowthPercent: '10',
    inflationPercent: '0',
  };
}
